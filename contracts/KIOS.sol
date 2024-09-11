// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Lockable} from "./Lockable.sol";

contract KIOS is ERC20, ERC20Burnable, Ownable, Lockable {
    constructor() ERC20("KIOS", "KIOS") Ownable(msg.sender) {
        _mint(msg.sender, 10000000000 * (10 ** 18));
    }

    function transfer(address to, uint256 value) public override onlyUnlocked(msg.sender, value) returns (bool) {
        return super.transfer(to, value);
    }

    function transferFrom(address from, address to, uint256 value) public override onlyUnlocked(from, value) returns (bool) {
        return super.transferFrom(from, to, value);
    }
}
