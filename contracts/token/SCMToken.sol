pragma solidity ^0.4.4;

import "./StandardToken.sol";

contract SCMToken is StandardToken {

    /* The following variables are optional vanities, One doesn't have to include them. 
    These allow for the customization of the token contract, and in no way influence the core functionality.
    Some wallets might not even look at this information */
    address public owner;
    string public name; // Human readable name for the token
    uint8 public decimals; // How many decimals to show. ie. There could be 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 Ether.
    string public symbol; // An identifier; ie. SCM
    bytes16 public version = 'H0.1'; // A version for the contract

    constructor() public
    {
        owner = msg.sender;
        balances[address(this)] = 10000; // Give the creator all the initial tokens
        totalTokens = 10000; // Update the total supply
        name = 'Scam'; // Set the token name for display purposes
        decimals = 18; // The amount of decimal units
        symbol = 'SCM'; // Set the symbol 
        emit Transfer(address(0), address(this), totalTokens);
    }

    /* Approves and then calls the receiving contract */
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

    function kill() external {
        require(msg.sender == owner, 'You aren\'t the owner');
        selfdestruct(owner);
    }
    // fallback function
    function() external {
        // if ETH is sent to this address, send it back.
        revert();
    }
}