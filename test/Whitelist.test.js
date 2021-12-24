const { assert } = require("chai");
const Whitelist = artifacts.require("./Whitelist");

require("chai").use(require("chai-as-promised")).should();

contract("Whitelist", (accounts) => {
  let contract;

  before(async () => {
    contract = await Whitelist.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = contract.address;
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.notEqual(address, 0x0);
    });
  });

  describe("operations as owner", async () => {
    it("should be able to flip whitelist state", async () => {
      let result = await contract.whitelistIsActive();
      assert.isFalse(result);
      await contract.flipWhitelistState();
      result = await contract.whitelistIsActive();
      assert.isTrue(result);
    });
    it("should be able to add one address to the whitelist and view it", async () => {
      await contract.addToWhitelist([accounts[2]]);
      let result = await contract.isWhitelisted(accounts[2]);
      assert.isTrue(result);
    });
    it("should be able to add multiple addresses to the whitelist and view them", async () => {
      await contract.addToWhitelist([
        accounts[3],
        accounts[4],
        accounts[5],
        accounts[6],
      ]);
      for (let i = 3; i <= 5; i++) {
        result = await contract.isWhitelisted(accounts[i]);
        assert.isTrue(result);
      }
    });
    it("should be able to remove one address from the whitelist and view it", async () => {
      await contract.removeFromWhitelist([accounts[2]]);
      let result = await contract.isWhitelisted(accounts[2]);
      assert.isFalse(result);
    });
    it("should be able to remove multiple addresses from the whitelist and view them", async () => {
      await contract.removeFromWhitelist([
        accounts[3],
        accounts[4],
        accounts[5],
        accounts[6],
      ]);
      for (let i = 3; i <= 5; i++) {
        result = await contract.isWhitelisted(accounts[i]);
        assert.isFalse(result);
      }
    });
  });

  describe("operations as not owner", async () => {
    it("should be able to view whitelisted address", async () => {
      await contract.isWhitelisted(accounts[7]);
      let result = await contract.isWhitelisted(accounts[7], {
        from: accounts[8],
        value: 0,
      });
      assert.isFalse(result);
    });
    it("should not be able to flip whitelist state", async () => {
      let result = await contract.whitelistIsActive({
        from: accounts[8],
        value: 0,
      });
      assert.isTrue(result);
      await contract.flipWhitelistState({
        from: accounts[8],
        value: 0,
      }).should.be.rejected;
    });
    it("should not be able to add one address to the whitelist", async () => {
      await contract.addToWhitelist([accounts[2]], {
        from: accounts[8],
        value: 0,
      }).should.be.rejected;
    });
    it("should not be able to add multiple addresses to the whitelist", async () => {
      await contract.addToWhitelist(
        [accounts[3], accounts[4], accounts[5], accounts[6]],
        {
          from: accounts[8],
          value: 0,
        }
      ).should.be.rejected;
    });
    it("should not be able to remove one address from the whitelist", async () => {
      await contract.removeFromWhitelist([accounts[2]], {
        from: accounts[8],
        value: 0,
      }).should.be.rejected;
    });
    it("should not be able to remove multiple addresses from the whitelist", async () => {
      await contract.removeFromWhitelist(
        [accounts[3], accounts[4], accounts[5], accounts[6]],
        {
          from: accounts[8],
          value: 0,
        }
      ).should.be.rejected;
    });
  });
});
