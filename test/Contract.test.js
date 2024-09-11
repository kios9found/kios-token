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

		assert.equal(balance0, 1000000000, 'Error?');
		assert.equal(balance1, 5000000, 'Error?');
	});

	let unlockNext;
	it('testLock', async () => {
		const instance = await Contract.deployed();
		const rst = await instance.lock(accounts[1], 5000000000000000000000000n, +(Date.now() / 1000).toFixed(0) + 10, 10, 1);
		const locked = await instance.locked(accounts[1]);
		unlockNext = new Number(locked.next);

		try {
			await instance.transfer(accounts[0], 50000000000000000000000n, { from: accounts[1] });
			assert.fail('Not must to be transfered!');
		} catch (e) {}
	});

	it('Waiting for Unlock', async () => {
		function timeout(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
		await timeout(15000);
	});

	it('testUnlock', async () => {
		const instance = await Contract.deployed();

		await instance.transfer(accounts[1], 50000000000000000000n);

		try {
			const rst = await instance.unlock(accounts[1]);
		} catch (e) {
			console.log(e);
			assert.fail('Must to be unlocked!');
		}

		try {
			await instance.transfer(accounts[0], 50000000000000000000000n, { from: accounts[1] });
		} catch (e) {
			assert.fail('Must to be transfered!');
		}
	});
});
