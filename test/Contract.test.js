const TokenName = 'KIOS';
const ContractName = 'KIOS';
const Contract = artifacts.require(ContractName);

contract(ContractName, (accounts) => {
	console.log('account0:', accounts[0]);
	console.log('account1:', accounts[1]);

	it('testName', async () => {
		const instance = await Contract.deployed();
		const name = await instance.name.call();

		assert.equal(name, TokenName, 'Different name!');
	});

	it('testBalance', async () => {
		const instance = await Contract.deployed();
		const balance0 = (await instance.balanceOf.call(accounts[0])) / 10 ** 18;
		await instance.transfer(accounts[1], 5000000000000000000000000n);
		const balance1 = (await instance.balanceOf.call(accounts[1])) / 10 ** 18;

		assert.equal(balance0, 10000000000, 'Error?');
		assert.equal(balance1, 5000000, 'Error?');
	});
});
