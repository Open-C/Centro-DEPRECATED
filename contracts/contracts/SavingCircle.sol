pragma solidity >=0.4.7;

//import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
//import "openzeppelin-solidity/contracts/math/SafeMath.sol";
//import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
//import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
//import "./utils/IERC20Token.sol";

contract ILendingPoolAddressesProvider {
    function getLendingPool() public view returns (address);
}

interface LendingPool {
    function deposit(address, uint256, uint16) external payable;
    function redeemUnderlying(address, address payable, uint256, uint256) external;
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

contract SavingCircle {

    ILendingPoolAddressesProvider lpa = ILendingPoolAddressesProvider(0x6EAE47ccEFF3c3Ac94971704ccd25C7820121483);

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
        uint cycleLength;
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
    
   
    function receive() public payable {}

    function startNewCycle(bytes32 circle) public newCycle(circle) {
        Circle storage circ = circles[circle];
        circ.numCycles++;
        circ.cycleEnd = block.timestamp + (circ.cycleLength * (1 days));
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

    function queryMissedPayments(bytes32 circleID) public view isMember(circleID) returns (address[] memory _addresses, uint[] memory _missedPayments) {
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

    function getMembers(bytes32 circle) public view returns (address[] memory) {
        return circles[circle].members;
    }

    function getCircles(address user) public view returns (bytes32[] memory) {
        return memberships[user];
    }

    function getCircleInfo(bytes32 circle) public view isMember(circle) returns (address[] memory, address, uint256, uint256, GovernanceType) {
        Circle storage circ = circles[circle];
        return (circ.members, circ.tokenAddress, circ.depositRequirement, circ.cycleLength, circ.govType);
    }

    function createCircle(string calldata uuid, address[] calldata members, address tokenAddr, uint256 depositAmount, GovernanceType govType, uint cycleLength, bool autoStart) external {
        bytes32 name = keccak256(abi.encodePacked(uuid));
        Circle storage circle = circles[name];

        circle.owner = msg.sender;
        circle.members = members;
        circle.tokenAddress = tokenAddr;
        circle.depositRequirement = depositAmount;
        circle.govType = govType;
        circle.cycleLength = cycleLength;
        
        if (autoStart) {
            circle.cycleEnd = block.timestamp + (cycleLength * (1 days));
        }

        for (uint256 i = 0; i < members.length; i++) {
            memberships[members[i]].push(name);
        }
    }

    function getBalances(bytes32 circleID) public view circleExists(circleID) isMember(circleID) returns (address[] memory, uint256[] memory) {
        Circle storage circle = circles[circleID];
        uint256[] memory balances = new uint256[](circle.members.length);

        for (uint256 i = 0; i < balances.length; i++) {
            balances[i] = circle.memberInfo[circle.members[i]].balance; 
        }
        return (circle.members, balances);
    }

    function getTotalBalance(bytes32 circleID) public view circleExists(circleID) isMember(circleID) returns (uint256, uint256) {
        LendingPool moola = getLendingPool();
        Circle storage circle = circles[circleID];
        (uint256 _moola, , , , , , , , , ) = moola.getUserReserveData(circle.tokenAddress, address(this));
        _moola = _moola * circle.total / totalBasis[circle.tokenAddress];
        return (_moola, circle.total);
    }

    function deposit(bytes32 circleID, address token, uint256 value) circleExists(circleID) isMember(circleID) payable external {
        Circle storage circle = circles[circleID];
        LendingPool moola = getLendingPool();
        require(token == circle.tokenAddress, "Incorrect token!");
        //ERC20(token).safeTransferFrom(msg.sender, address(this), value);
        //ERC20(token).approve(address(moola), value);
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
        withdrawMoola(circleID, req.amount);
        //ERC20(circle.tokenAddr).safeTransfer(req.requester, req.amount);
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
        withdrawMoola(circleID, amt);
        //ERC20(circle.tokenAddr).safeTransfer(msg.sender, amt);
        circle.memberInfo[msg.sender].balance -= amt;
    }

    function withdrawMoola(bytes32 circleID, uint256 amt) private {
        Circle storage circle = circles[circleID];
        LendingPool moola = getLendingPool();
        moola.redeemUnderlying(circle.tokenAddress, address(uint160(address(this))), amt, 0);
    }
}