// import { task } from "hardhat/config";
// import "@nomiclabs/hardhat-waffle";

// // This is a sample Hardhat task. To learn how to create your own go to
// // https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (args, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(await account.address);
//   }
// });

// // You need to export an object to set up your config
// // Go to https://hardhat.org/config/ to learn more

// export default {
//   solidity: "0.8.1",
// };
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-waffle";
import "@ubeswap/hardhat-celo";
import { fornoURLs, ICeloNetwork } from "@ubeswap/hardhat-celo";
import "dotenv/config";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import { removeConsoleLog } from "hardhat-preprocessor";
import "hardhat-spdx-license-identifier";
import "hardhat-watcher";
import { HardhatUserConfig, task } from "hardhat/config";
import { ActionType, HDAccountsUserConfig } from "hardhat/types";
import "solidity-coverage";

task(
  "deploy",
  "Deploys contracts",
  async (...args: Parameters<ActionType<{ step: string }>>) => {
    return await (await import("./tasks/deploy")).deploy(...args);
  }
).addParam("step", "The step to deploy");

task(
  "liveTest",
  "Tests the connectors on the specified network",
  async (...args: Parameters<ActionType<{ step: string }>>) => {
    return await (await import("./tasks/tests")).test(...args);
  }
).addParam("step", "The step to deploy");

// task("test", "Test the contracts", async () => {});
const accounts: HDAccountsUserConfig = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
  path: "m/44'/52752'/0'/0/",
};

// const accounts = [
//   {
//     privateKey: `0x${process.env.PRIVATE_KEY_DEV}`,
//     balance: "0",
//   },
// ];

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  abiExporter: {
    path: "./build/abi",
    flat: true,
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    mainnet: {
      url: fornoURLs[ICeloNetwork.MAINNET],
      accounts,
      chainId: ICeloNetwork.MAINNET,
      live: true,
      gasPrice: 0.5 * 10 ** 10,
      gas: 8000000,
    },
    alfajores: {
      url: fornoURLs[ICeloNetwork.ALFAJORES],
      accounts,
      chainId: ICeloNetwork.ALFAJORES,
      live: true,
      gasPrice: 0.5 * 10 ** 9,
      gas: 2500000,
    },
    hardhat: {
      chainId: 31337,
      accounts,
    },
  },
  paths: {
    deploy: "scripts/deploy",
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== "hardhat" && bre.network.name !== "localhost"
    ),
  },
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
      },
    },
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
} as HardhatUserConfig;
