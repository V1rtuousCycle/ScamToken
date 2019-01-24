### Avoiding Vulnerabilities
Using the `SafeMath` library to avoid overflow attacks.
Adjusting the contract state variables first, before calling other contracts using call or delegatecall.
```
uint256 senderBalance = balances[msg.sender];
balances[msg.sender] = 0;

scm.transfer(msg.sender, (senderBalance.mul(10)));
```

Not exposing my personal private keys while importing the mnemonic. 

