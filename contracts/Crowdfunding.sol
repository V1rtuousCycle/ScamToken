pragma solidity ^0.4.4;

import './token/WETH.sol';
import './ScamToken.sol';

contract Crowdfunding {
    bool public active = true;
    mapping (address => uint256) public balances;
    uint256 public totalWethRaised;
    uint256 public rate;
    uint256 public timeout;
    WETH9 public weth = WETH9(0xc778417E063141139Fce010982780140Aa0cD5Ab);
    ScamToken public SCM;
    
    event Purchase(address indexed buyer, uint indexed value, uint amount);
    event FailedPurchase(address indexed buyer, uint amount);
    event Withdrawl(address recipient, uint256 amount);

    constructor(ScamToken _scm, uint256 _rate) {
        SCM = _scm;
        rate = _rate;
    }
    
    function purchase(uint16 _amount) public returns(bool) {
        require(active, "The auction is over. Great job, avoiding this trap took intuition.");

        if (weth.transferFrom(msg.sender, address(this), _amount)) {
            if (totalWethRaised + _amount >= 1000) {
                uint256 excessFunds = totalWethRaised + _amount - 1000;
                weth.approve(msg.sender, excessFunds);
                weth.transfer(msg.sender, excessFunds);
                totalWethRaised += _amount - excessFunds;
                balances[msg.sender] += _amount - excessFunds;
                active = false;
                timeout = now;
                emit Purchase(msg.sender, (_amount * 10), _amount);
                return true;
            } else {
                totalWethRaised += _amount;
                balances[msg.sender] += _amount;
                emit Purchase(msg.sender, (_amount * 10), _amount);
                return true;
            }
        } else {
            emit FailedPurchase(msg.sender, _amount);
        }
    }

    function withdraw() {
        require(!active && (now > timeout + 120), "The super compounding funds aren't ready to be claimed yet.");
        require(balances[msg.sender] >= 0);

        SCM.transfer(msg.sender, (balances[msg.sender] * 10));
        balances[msg.sender] = 0;

    }

    function() public {

    }
}