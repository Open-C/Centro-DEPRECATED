const fs = require("fs");
const path = require("path");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const accountsPath = path.join(__dirname, "./accounts.json");
const getAccount = require("./getAccount").getAccount;
const currentAccts = require("./accounts.json");

const getName = () =>
  new Promise((resolve) =>
    rl.question("Enter your name: ", (input) => {
      rl.close();
      resolve(input);
    })
  );
// {
//   let name;
//   readline.question("Enter your name: ", (n) => {
//     name = n;
//     readline.close();
//   });
//   return name;
// };

const createAccount = async (acctsObj) => {
  const acct = await getAccount();
  const name = await getName();
  acctsObj.addrs[name] = acct.address;
  jsonStr = JSON.stringify(acctsObj);
  fs.writeFile(accountsPath, jsonStr, (err) => {
    if (err) {
      console.log("An error occured writing to the file.");
      console.log("Please copy and paste your address into accounts.json");
      console.log(acct.address);
    } else {
      console.log("Task failed successfully");
    }
  });
};

createAccount(currentAccts);
