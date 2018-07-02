pragma solidity ^0.4.4;

contract MountedContract {
    uint256 public totalValue;

    constructor() public payable {
    
    }

    function() external payable {

    }
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract MountContract {
    MountedContract public mounted;
    uint public lastDeposit;

    constructor() public payable {
        
    }

    function Mount(address _mountAddr) payable public {
        mounted = MountedContract(_mountAddr);
    }

    function callMounted() public payable {
        address(mounted).transfer(msg.value);
    }
    
    function addressMounted() public view returns (address) {
        return address(mounted);
    }
    
    function viewAddress() public view returns (address) {
        return address(this);
    }
    
    function viewBalance() public view returns (uint) {
        return address(this).balance;
    }

    function() external payable {
        if (msg.value > 0) 
            lastDeposit =  msg.value; 
    }



}