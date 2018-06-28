pragma solidity ^0.4.4;

interface Token {

    /* Events */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /* Public Functions */

    /// @param _to - The address you want to transfer to
    /// @param _value - How many tokens you are transfering
    /// @return Whether the transfer was successful or not
    function transfer(address _to, uint _value) external returns (bool success);

    /// @param _to - The address you want to transfer to
    /// @param _from - The address you want to transfer from
    /// @param _value - The amount of tokens being transferred
    /// @return Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint _value) external returns (bool success);
    
    /// @param _spender - The address of the account able to transfer the tokens
    /// @param _value - The amount of wei to be approved for transfer
    /// @return success Whether the approval was successful or not
    function approve(address _spender, uint _value) external returns (bool sucess);

    /// @param _owner - The address of the account owning the tokens
    /// @return - The balance of the address owning the tokens
    function balanceOf(address _owner) external view returns (uint256 balance);

    /// @param _owner - The address of the account owing tokens
    /// @param _spender - The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    /// @return the total amount of tokens
    function totalSupply() external view returns (uint256 supply);
}
