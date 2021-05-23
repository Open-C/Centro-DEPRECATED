pragma solidity ^0.8.0;

//import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
//import "openzeppelin-solidity/contracts/math/SafeMath.sol";
//import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "./utils/IERC20Token.sol";

abstract contract ILendingPoolAddressesProvider {
    function getLendingPool() public view virtual returns (address);
    function getLendingPoolCore() public view virtual returns (address payable);
}

interface LendingPool {
    function deposit(address, uint256, uint16) external payable;
    function getUserReserveData(address _reserve, address _user) external view
        returns (
            uint256 currentATokenBalance,
            uint256 currentBorrowBalance,
            uint256 principalBorrowBalance,
            uint256 borrowRateMode,
            uint256 borrowRate,
            uint256 liquidityRate,
            uint256 originationFee,
            uint256 variableBorrowIndex,
            uint256 lastUpdateTimestamp,
            bool usageAsCollateralEnabled
        );
}

interface AToken {
    function redeem(uint256) external;
}

contract SavingCircle {

    ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(0x6EAE47ccEFF3c3Ac94971704ccd25C7820121483);
    address mcUSD = address(0x71DB38719f9113A36e14F409bAD4F07B58b4730b);

    enum GovernanceType {
        anarchy,
        democratic,
        dictator
    }

    struct User {
        uint256 balance;
        uint256 missedPayments;
        uint256 amtContributed;
        bool isAlive;
    }

    struct Request {
        uint256 approvals;
        uint256 denials;
        uint256 amount;
        address requester;
    }

    struct Circle {
        address owner;
        address[] members;
        mapping (address => User) memberInfo;
        address tokenAddress;
        uint cycleEnd;
        uint cycleTime;
        uint numCycles;
        uint256 depositRequirement;
        uint256 total;
        GovernanceType govType;
        Request[] requests;
    }
    mapping(bytes32 => Circle) circles;
    mapping(address => bytes32[]) memberships;
    mapping(address => uint256) totalBasis;

    event ContributionMade(address user, bytes32 circle, uint256 amount);
    event RequestMade(address requester, bytes32 circle, uint256 amount);
    event RequestGranted(address requester, bytes32 circle, uint256 amount);

    modifier onlyOwner(address owner) {
        require(msg.sender == owner);
        _;
    }

    modifier circleExists(bytes32 circle) {
        require(circles[circle].members.length > 0);
        _;
    }

    modifier isMember(bytes32 circleID) {
        require(circles[circleID].memberInfo[msg.sender].isAlive, "Not a member");
        _;
    }

    modifier newCycle(bytes32 circleID) {
        require(circles[circleID].cycleEnd < block.timestamp, "There is still time left!");
        _;
    }
    
    receive() external payable {}

    function startNewCycle(bytes32 circle) public circleExists(circle) newCycle(circle) {
        Circle storage circ = circles[circle];
        circ.numCycles++;
        circ.cycleEnd = block.timestamp + (circ.cycleTime * (1 days));
        for (uint i = 0; i < circ.members.length; i++) {
            uint amtContributed = circ.memberInfo[circ.members[i]].amtContributed;
            if (amtContributed < circ.depositRequirement) {
                circ.memberInfo[circ.members[i]].missedPayments += circ.depositRequirement - amtContributed;
                circ.memberInfo[circ.members[i]].amtContributed = 0;
            } else {
                circ.memberInfo[circ.members[i]].amtContributed = amtContributed - circ.depositRequirement;
            }
            
        }
    }

    function queryMissedPayments(bytes32 circleID) public view circleExists(circleID) returns (address[] memory _addresses, uint[] memory _missedPayments) {
        mapping(address => User) storage memberInfo = circles[circleID].memberInfo;
        _addresses = circles[circleID].members;
        uint[] memory missed = new uint[](_addresses.length);
        for (uint i = 0; i < _addresses.length; i++) {
            missed[i] = memberInfo[_addresses[i]].missedPayments;
        }
        _missedPayments = missed;
    }

    function getLendingPool() private view returns (LendingPool) {
        return LendingPool(lpa.getLendingPool());
    }

    function getLendingPoolCore() private view returns (address payable) {
        return lpa.getLendingPoolCore();
    }

    function getMembers(bytes32 circle) public view circleExists(circle) returns (address[] memory) {
        return circles[circle].members;
    }

    function getCircles(address user) public view returns (bytes32[] memory) {
        return memberships[user];
    }

    function getCircleInfo(bytes32 circle) public view returns (address[] memory, address, uint256, uint256, GovernanceType) {
        Circle storage circ = circles[circle];
        return (circ.members, circ.tokenAddress, circ.depositRequirement, circ.cycleTime, circ.govType);
    }

    function getRequests(bytes32 circleID) public view circleExists(circleID) returns (uint[] memory _approvals, uint[] memory _denials, address[] memory _addresses, uint256[] memory _amounts) {
        Request[] storage requests = circles[circleID].requests;
        uint len = requests.length;
        _approvals = new uint[](len);
        _denials = new uint[](len);
        _addresses = new address[](len);
        _amounts = new uint256[](len);
        for (uint i = 0; i < len; i++) {
            Request memory cur = requests[i];
            _approvals[i] = cur.approvals;
            _denials[i] = cur.denials;
            _addresses[i] = cur.requester;
            _amounts[i] = cur.amount;
        }
        
    }

    function createCircle(string calldata uuid, address[] calldata members, address tokenAddr, uint256 depositAmount, GovernanceType govType, uint cycleTime, bool autoStart) external {
        require(members[0] != address(0), "Must contain members");
        bytes32 name = keccak256(abi.encodePacked(uuid));
        Circle storage circle = circles[name];

        circle.owner = msg.sender;
        circle.members = members;
        circle.tokenAddress = tokenAddr;
        circle.depositRequirement = depositAmount;
        circle.govType = govType;
        circle.cycleTime = cycleTime;
        
        if (autoStart) {
            circle.cycleEnd = block.timestamp + (cycleTime * (1 days));
        }

        for (uint256 i = 0; i < members.length; i++) {
            memberships[members[i]].push(name);
            circle.memberInfo[members[i]].isAlive = true;
        }
    }

    function getBalances(bytes32 circleID) public view circleExists(circleID) returns (address[] memory, uint256[] memory) {
        Circle storage circle = circles[circleID];
        uint256[] memory balances = new uint256[](circle.members.length);

        for (uint256 i = 0; i < balances.length; i++) {
            balances[i] = circle.memberInfo[circle.members[i]].balance; 
        }
        return (circle.members, balances);
    }

    function getTotalBalance(bytes32 circleID) public view circleExists(circleID) returns (uint256, uint256) {
        LendingPool moola = getLendingPool();
        Circle storage circle = circles[circleID];
        (uint256 _moola, , , , , , , , , ) = moola.getUserReserveData(circle.tokenAddress, address(this));
        _moola = _moola * circle.total / totalBasis[circle.tokenAddress];
        return (_moola, circle.total);
    }



    function deposit(bytes32 circleID, address token, uint256 value) external {
        require(circles[circleID].memberInfo[msg.sender].isAlive, "Not a member");
        Circle storage circle = circles[circleID];
        require(token == circle.tokenAddress, "Incorrect token!");
        IERC20(token).transferFrom(msg.sender, address(this), value);
        
        LendingPool moola = getLendingPool();
        address payable lpCore = getLendingPoolCore();
        require(IERC20(token).approve(lpCore, value), "Approval for LP core failed");
        moola.deposit(token, value, 0);

        circle.total += value;
        circle.memberInfo[msg.sender].balance += value;
        circle.memberInfo[msg.sender].amtContributed += value;
        totalBasis[token] += value;
    }

    function request(bytes32 circleID, uint256 value) circleExists(circleID) isMember(circleID) external {
        Circle storage circle = circles[circleID];
        Request memory newRequest;
        newRequest.amount = value;
        newRequest.requester = msg.sender;
        emit RequestMade(msg.sender, circleID, value);
        circle.requests.push(newRequest);
    }

    function vote(bytes32 circleID, uint256 requestIndex, bool approved) circleExists(circleID) isMember(circleID) external {
        Circle storage circle = circles[circleID];
        Request storage req = circle.requests[requestIndex];
        uint256 threshold = circle.members.length / 2;
        if (circle.govType == GovernanceType.dictator && circle.owner == msg.sender) {
            if (approved) approveRequest(circleID, requestIndex);
            else deleteRequest(circleID, requestIndex);
        } else {
            if (approved) req.approvals++;
            else req.denials++;

            if (((req.approvals * 100) / circle.members.length) > threshold) approveRequest(circleID, requestIndex);
            if (((req.denials * 100) / circle.members.length) > threshold) deleteRequest(circleID, requestIndex);
        }
    }

    function approveRequest(bytes32 circleID, uint256 requestIndex) private {
        Circle storage circle = circles[circleID];
        Request storage req = circle.requests[requestIndex];
        withdrawMoola(req.amount);
        IERC20(circle.tokenAddress).approve(req.requester, req.amount);
        IERC20(circle.tokenAddress).transfer(req.requester, req.amount);
        circle.memberInfo[req.requester].balance -= req.amount;
        deleteRequest(circleID, requestIndex);
    }

    function deleteRequest(bytes32 circleID, uint256 requestIndex) private {
        Circle storage circle = circles[circleID];
        circle.requests[requestIndex] = circle.requests[circle.requests.length - 1];
        delete circle.requests[circle.requests.length - 1];
    }

    function withdraw(bytes32 circleID, uint256 amt) isMember(circleID) external {
        Circle storage circle = circles[circleID];
        require(circle.memberInfo[msg.sender].balance >= amt, "Cannot withdraw more than deposited");
        withdrawMoola(amt);
        IERC20(circle.tokenAddress).approve(msg.sender, amt);
        IERC20(circle.tokenAddress).transfer(msg.sender, amt);
        circle.memberInfo[msg.sender].balance -= amt;
    }

    function withdrawMoola(uint256 amt) internal {
        //Circle storage circle = circles[circleID];
        //LendingPool moola = getLendingPool();
        //moola.redeemUnderlying(circle.tokenAddress, payable(address(this)), amt, 0);
        AToken(mcUSD).redeem(amt);
    }
}