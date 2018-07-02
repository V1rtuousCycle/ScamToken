pragma solidity ^0.4.4;
import "../../node_modules/openzeppelin-solidity/contracts/LimitBalance.sol";

contract LimitedBalanceContract is LimitBalance(50) {
    string name;
    uint256 public balance = address(this).balance;
    uint public difficulty = block.difficulty;
    
    constructor(string _name) public {
        name = _name;
    }

    function() external payable limitedPayable {

    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}