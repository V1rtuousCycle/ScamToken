pragma solidity ^0.4.4;

// Contract Were Importing with the name
contract Contract {
    string public Name;
    uint256 public ETH;

    event DepositMoney(address indexed _owner, uint256 _value);

    function Contract (string trueName) {
        Name = trueName;
    }
    
    function depositEther() public payable {
        ETH = ETH + msg.value;
        emit DepositMoney(msg.sender, msg.value);
    }
}

contract Factory {
    address[] public newContracts;
    Contract public newContract;

    event Deposit(address indexed depositor, uint256 value);

    function createContract (string name) {
        newContract = new Contract(name);
        newContracts.push(newContract);
    }

    function firstContractBalance() view returns (uint) {
        return newContract.balance;
    }

    function() payable {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
        }
    }
}
