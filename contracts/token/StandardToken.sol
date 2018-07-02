pragma solidity ^0.4.4;

import "./Token.sol";
import "../lib/SafeMath.sol";

contract StandardToken is Token {
    using Math for *;

    // the listing of account balances
    mapping (address => uint256) balances;
    // the listing of account allowed values
    mapping (address => mapping(address => uint256)) allowed;
    // a change in the ERC20 protocol to create an unlimited allowance
    uint constant MAX_UINT = 2**256 - 1;
    uint256 public totalTokens;

    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Default assumes totalSupply can't be over max (2^256 - 1)
        // If your token leaves out totalSupply and can issue mor tokens as time goes on, you need to check if it doesn't wrap.
        // Replace the if with this one instead.
        // if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            emit Transfer(msg.sender, _to, _value);
            return true;
        } else {
            return false;
        }
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // same as above. Replace this line with the following if you want to protect against wrapping uints.
        // if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        uint allowance = allowed[_from][msg.sender];    
        require(balances[_from] >= _value && allowance >= _value && _value > 0);
            balances[_to] += _value;
            balances[_from] -= _value;
            if (allowance < MAX_UINT) {
                allowed[_from][msg.sender] -= _value;
            }
            emit Transfer(_from, _to, _value);
            return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function totalSupply() public view returns(uint256) {
        return totalTokens;
    }
}