// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

//  ▄█     █▄     ▄█    █▄     ▄█      ███        ▄████████  ▄█        ▄█     ▄████████     ███
// ███     ███   ███    ███   ███  ▀█████████▄   ███    ███ ███       ███    ███    ███ ▀█████████▄
// ███     ███   ███    ███   ███▌    ▀███▀▀██   ███    █▀  ███       ███▌   ███    █▀     ▀███▀▀██
// ███     ███  ▄███▄▄▄▄███▄▄ ███▌     ███   ▀  ▄███▄▄▄     ███       ███▌   ███            ███   ▀
// ███     ███ ▀▀███▀▀▀▀███▀  ███▌     ███     ▀▀███▀▀▀     ███       ███▌ ▀███████████     ███
// ███     ███   ███    ███   ███      ███       ███    █▄  ███       ███           ███     ███
// ███ ▄█▄ ███   ███    ███   ███      ███       ███    ███ ███▌    ▄ ███     ▄█    ███     ███
//  ▀███▀███▀    ███    █▀    █▀      ▄████▀     ██████████ █████▄▄██ █▀    ▄████████▀     ▄████▀
//                                                          ▀

import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {
    bool public whitelistIsActive = false;

    mapping(address => bool) _whitelist;

    modifier whitelistOnly() {
        require(isWhitelisted(msg.sender), "Msg.sender is not whitelisted.");
        _;
    }

    modifier whiteListActive() {
        require(whitelistIsActive, "Whitelist is not active yet.");
        _;
    }

    function flipWhitelistState() external onlyOwner {
        whitelistIsActive = !whitelistIsActive;
    }

    function addToWhitelist(address[] memory addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Can't add the null address.");
            _whitelist[addresses[i]] = true;
        }
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return _whitelist[addr];
    }

    function removeFromWhitelist(address[] calldata addresses)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            _whitelist[addresses[i]] = false;
        }
    }
}
