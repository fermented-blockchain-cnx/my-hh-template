import "@tenderly/hardhat-tenderly"

import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-solhint"
import "@nomiclabs/hardhat-waffle"
import "@openzeppelin/hardhat-upgrades"
import "@typechain/hardhat"
import "dotenv/config"
import "hardhat-abi-exporter"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import "hardhat-watcher"
import { HardhatUserConfig, task } from "hardhat/config"
import "solidity-coverage"
const fs = require("fs")

const { Confirm } = require("enquirer")

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const config: HardhatUserConfig = {
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
        },
    },
    networks: {
        localhost: {
            url: "http://localhost:8545",
        },
        rinkeby: {
            url: "https://rinkeby.infura.io/v3/", // <---- YOUR INFURA ID! (or it won't work)
            accounts: [PRIVATE_KEY],
        },
        mainnet: {
            url: "https://mainnet.infura.io/v3/",
            accounts: [PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            rinkeby: process.env.ETHERSCAN_API_KEY,
            goerli: process.env.ETHERSCAN_API_KEY,
            mainnet: process.env.ETHERSCAN_API_KEY,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.9",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    paths: {
        cache: "./generated/cache",
        artifacts: "./generated/artifacts",
        deployments: "./generated/deployments",
    },
    typechain: {
        outDir: "./typechain",
    },
    watcher: {
        compile: {
            tasks: ["clean", "compile"],
            files: ["./contracts", "./test"],
            verbose: true,
        },
        ci: {
            tasks: [
                "clean",
                { command: "compile", params: { quiet: true } },
                {
                    command: "test",
                    params: { noCompile: true, testFiles: ["test/css.mint.test.ts"] },
                },
            ],
        },
    },
}
export default config

task("deploy")
    //   .addOptionalParam("network", "Network")
    .setAction(async (taskArgs, hre, runSuper) => {
        const { network } = taskArgs
        console.log(`Deploying...`)

        const accounts = await hre.ethers.getSigners()

        const prompt = new Confirm({
            name: "question",
            message: `Confirm to deploy with ${accounts[0].address}`,
        })

            ; (await prompt.run()) && (await runSuper(taskArgs))
    })
