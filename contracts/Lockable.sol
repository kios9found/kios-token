// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

abstract contract Lockable is ERC20, Ownable {
	struct Locked {
		uint next;
		uint interval;
		uint256 remains;
		uint256 perUnlock;
	}

	mapping (address => Locked) public locked;

	event Lock(address holder, uint256 amount, uint startAt, uint interval, uint ratio, uint256 perUnlock);
	event Unlock(address holder, uint256 unlocked, uint256 remains);

	function lock(address holder, uint256 amount, uint startAt, uint interval, uint ratio) public onlyOwner() returns (bool) {
		uint256 perUnlock = Math.ceilDiv(amount / (10 ** (18 + 2)), ratio) * 10 ** 18;
		Locked memory newLock = Locked(startAt, interval, amount, perUnlock);
		locked[holder] = newLock;

		emit Lock(holder, amount, startAt, interval, ratio, perUnlock);

		return true;
	}

	function unlock(address holder) public onlyOwner() returns (uint256) {
		require(locked[holder].remains > 0, "Zero remains.");
		require(locked[holder].next < block.timestamp, "Locking duration has not expired!");

		unchecked {
			uint n = Math.ceilDiv(block.timestamp - locked[holder].next, locked[holder].interval) + 1;
			uint256 toUnlock = locked[holder].perUnlock * n;
			if (toUnlock > locked[holder].remains) toUnlock = locked[holder].remains;
			uint256 remains = locked[holder].remains - toUnlock;

			if (remains > 0) {
				locked[holder].next = locked[holder].next + n * locked[holder].interval;
				locked[holder].remains = remains;
			} else {
				delete locked[holder];
			}

			emit Unlock(holder, toUnlock, remains);

			return toUnlock;
		}
	}

    modifier onlyUnlocked(address holder, uint256 value) {
        require(balanceOf(holder) - value > locked[holder].remains, "Insufficient balance!");
        _;
    }
}
