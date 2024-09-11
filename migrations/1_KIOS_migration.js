const KIOS = artifacts.require('KIOS');
module.exports = function (deployer) {
	deployer.deploy(KIOS);
};
