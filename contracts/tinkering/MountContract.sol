pragma solidity ^0.4.4;

contract MountedContract {
    uint256 public totalValue;

    function() payable {
        if (msg.value > 0) {
            totalValue += msg.value;
        }
    }
}

contract MountContract {
    MountedContract mounted;

    function Mount(address _mountAddr) public {
        mounted = MountedContract(_mountAddr);
    }

    function callMounted() public payable {
        mounted.call().value(100).gas(1000);
    }

}