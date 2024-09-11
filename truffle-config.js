const HDWalletProvider = require('@truffle/hdwallet-provider');
const { MNEMONIC, BSCSCAN_APIKEY } = require('./env.json');

module.exports = {
	plugins: ['truffle-plugin-verify'],
	api_keys: {
		bscscan: BSCSCAN_APIKEY,
	},
	networks: {
		'BSC-Mainnet': {
			provider: () =>
				new HDWalletProvider({
					mnemonic: MNEMONIC,
					derivationPath: "m/44'/60'/0'/0",
					providerOrUrl: 'https://bsc-dataseed-public.bnbchain.org',
				}),
			network_id: 56,
			gas: 5000000,
			gasPrice: 1000000000,
			confirmations: 10,
			timeoutBlocks: 200,
			skipDryRun: true,
		},
	},
	mocha: {
	},
	compilers: {
		solc: {
			version: '0.8.26',
			settings: {
				optimizer: {
					enabled: true,
					runs: 200,
				},
				evmVersion: 'london',
			},
		},
	},
};
