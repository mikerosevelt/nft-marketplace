// require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/0b8928c1a3f74a739cf9250a38f065ad',
      accounts: [
        'c28a4e53a36aa14728c86435a20cf2500b49275102274e5e40860aeed98b2456'
      ]
    }
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
