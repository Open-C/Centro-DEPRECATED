import { ICeloNetwork, networkNames } from "@ubeswap/hardhat-celo";
import { promises as fs } from "fs";
import { ActionType, HardhatRuntimeEnvironment } from "hardhat/types";
import { TestMoolaConnector } from "./MoolaConnector-test";

export type TestFunction = (
  env: HardhatRuntimeEnvironment
) => Promise<{ [testName: string]: string }>;

export type UnitTest = Promise<Record<string, string>>;

const testers: { [step: string]: TestFunction } = {
  moola: TestMoolaConnector,
};

const makeConfigPath = (step: string, chainId: ICeloNetwork): string =>
  __dirname +
  `/../../deployments/${step}.${networkNames[chainId]}.addresses.json`;

export const getDeployment = async (
  step: string,
  chainId: ICeloNetwork
): Promise<Record<string, string>> => {
  const configPath = makeConfigPath(step, chainId);
  return JSON.parse((await fs.readFile(configPath)).toString());
};

export const test: ActionType<{ step: string }> = async ({ step }, env) => {
  console.log(step);
  const chainId = await env.celo.kit.connection.chainId();
  const tester = testers[step];
  if (!tester) {
    throw new Error(`Unknown step: ${step}`);
  }
  const result = await tester(env);
  //await writeDeployment(step, chainId, result);
  console.log(result);
};
