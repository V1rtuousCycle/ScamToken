pragma solidity ^0.4.4;

import 'token/WETH.sol';

contract Crowdfunding {
    bool active = true;
    mapping (address => uint256) balances;
    uint256 public totalWethRaised;
    uint256 public rate;
    WETH9 public weth = WETH9(0xc778417E063141139Fce010982780140Aa0cD5Ab);
    ScamToken public scamtoken;
    event Purchase(address indexed buyer, uint indexed value, uint amount, );
    event FailedPurchase(bool failure);

    constructor(uint256 _rate, address _wallet, )

    
    function purchase(uint16 _amount) public {
        require(active);
        if (weth.transferFrom(msg.sender, address(this), _amount)) {
            if (totalWethRaised + _amount >= 1000) {
                weth.transfer()
            }
            emit Purchase(msg.sender, _amount);
        } else {
            emit FailedPurchase(true);
        }
    }

    function withdraw(uint16 _amount) {
        require(!active);
        require(balances[msg.sender >= _amount]);
        balances[msg.sender] -= _amount;
        SCM.transfer(balances[msg.sender])
    }

    function() public {
        require(msg.value = 0, "Please do not send Ether to this account");
    }
}