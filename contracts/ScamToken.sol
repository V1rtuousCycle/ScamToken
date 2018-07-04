pragma solidity ^0.4.4;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract ScamToken is StandardToken {
    string public name; // Human readable name for the token
    uint8 public decimals; // How many decimals to show. ie. There could be 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 Ether.
    string public symbol; // An identifier; ie. SCM
    bytes16 public version = 'v0.1'; // A version for the contract

    constructor() public
    {
        balances[/* ICO Address */0] = 10000; // Give the ICO address all the initial tokens
        totalSupply_ = 10000; // Update the total supply
        name = 'Scam Token'; // Set the token name for display purposes
        decimals = 18; // The amount of decimal units
        symbol = 'SCM'; // Set the symbol 
        emit Transfer(address(0), /* ICO Address */0, totalSupply_);
    }

    /* Approves and then calls the receiving contract 
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    
        // call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
        // receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        // it is assumed that when does this that the call *should* succeeed, otherwise one would use vanilla approve instead.
        if(!_spender.call(bytes4(bytes32(keccak256("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) {
            revert('The spender receiveApproval function is not working.');
        }
        return true;
    }
    */

    function() external {
        // if ETH is sent to this address, send it back.
        revert();
    }

}

