### Design Patterns
Pretty standard ERC20 and ICO Crowdfunding address patterns. Favoring security and readability over elegance.
Using innheritance from the `openzeppelin-solidity` well tested library, rather than re-writing my own. 
Making a non-payable fallback function, so that no Ether is accidenntally sent to the contract. 
Emitting clear events upon interaction.
