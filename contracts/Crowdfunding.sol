pragma solidity ^0.4.4;

import './token/WETH.sol';
import './ScamToken.sol';

contract Crowdfunding {
    bool active = true;
    mapping (address => uint256) balances;
    uint256 public totalWethRaised;
    uint256 public rate;
    WETH9 public weth = WETH9(0xc778417E063141139Fce010982780140Aa0cD5Ab);
    ScamToken public SCM;
    event Purchase(address indexed buyer, uint indexed value, uint amount);
    event FailedPurchase(bool failure);

    constructor(ScamToken _scm) {
        SCM = _scm;
    }
    
    function purchase(uint16 _amount) public {
        require(active);
        if (weth.transferFrom(msg.sender, address(this), _amount)) {
            if (totalWethRaised + _amount >= 1000) {
                weth.transfer(0x2624d45cA77c065999d2328b3e8f2D7Bc53a5779, 50);
            }
            emit Purchase(msg.sender, (_amount * 10), _amount);
        } else {
            emit FailedPurchase(true);
        }
    }

    function withdraw(uint16 _amount) {
        require(!active);
        require(balances[msg.sender] >= _amount);
        balances[msg.sender] -= _amount;
    }

    function() public {

    }

    /* Internal Interface */
}