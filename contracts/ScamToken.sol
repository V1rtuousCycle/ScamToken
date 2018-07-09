pragma solidity ^0.4.4;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract ScamToken is StandardToken {
    string public name; // Human readable name for the token
    uint8 public decimals; // How many decimals to show. ie. There could be 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 Ether.
    string public symbol; // An identifier; ie. SCM
    bytes16 public version = 'v0.1'; // A version for the contract

    constructor() public
    {
        totalSupply_ = 10000000000000000000; // Update the total supply
        balances[msg.sender] = 10000000000000000000; // Give the ICO address all the initial tokens
        name = 'Scam Token'; // Set the token name for display purposes
        decimals = 18; // The amount of decimal units
        symbol = 'SCM'; // Set the symbol 
        emit Transfer(address(0), msg.sender, totalSupply_);
    }

    function() external {
        // if ETH is sent to this address, send it back.
        revert();
    }
}