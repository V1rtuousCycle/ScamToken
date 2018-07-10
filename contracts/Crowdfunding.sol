pragma solidity ^0.4.4;

import './token/WETH.sol';
import './ScamToken.sol';

contract Crowdfunding {
    // Rinkeby WETH contract
    WETH9 public weth;
    ScamToken public scm;
    
    bool public active = true;
    mapping (address => uint256) public balances;
    uint256 public totalWeiRaised;
    uint256 public timeout;
    
    event Purchase(address indexed buyer, uint indexed value, uint amount);
    event FailedPurchase(address indexed buyer, uint amount);
    event Withdrawl(address recipient, uint256 amount);

    constructor(ScamToken _scm, WETH9 _weth) {
        scm = _scm;
        weth = _weth;
    }
    
    function purchase(uint _amount) public returns(bool) {
        require(active, "The auction is over. Great job, avoiding this trap took intuition.");
        if (weth.transferFrom(msg.sender, address(this), _amount)) {
            if (totalWeiRaised + _amount >= 1000 ether) {
                uint256 excessFunds = totalWeiRaised + _amount - 1000 ether;
                weth.approve(msg.sender, excessFunds);
                weth.transfer(msg.sender, excessFunds);
                totalWeiRaised += _amount - excessFunds;
                balances[msg.sender] += _amount - excessFunds;
                active = false;
                timeout = now;
                emit Purchase(msg.sender, (_amount/(1 ether) * 10), _amount/(1 ether));
                return true;
            } else {
                totalWeiRaised += _amount;
                balances[msg.sender] += _amount;
                emit Purchase(msg.sender, (_amount/(1 ether) * 10), _amount/(1 ether));
                return true;
            }
        } else {
            emit FailedPurchase(msg.sender, _amount/(1 ether));
        }
    }

    function withdraw() {
        require(!active && (now > timeout + 120), "The super compounding funds aren't ready to be claimed yet.");
        require(balances[msg.sender] >= 0);
        uint256 senderBalance = balances[msg.sender];
        balances[msg.sender] = 0;

        scm.transfer(msg.sender, (senderBalance * 10));

    }

    function() public {

    }
}