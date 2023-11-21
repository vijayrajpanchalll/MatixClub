const { expect } = require("chai");
const { ethers } = require("hardhat");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("MatrixClub", function () {
    async function deployTokenFixture() {
        const accounts = await ethers.getSigners();
        const owner = accounts[0];
        const user = accounts[1];
        const referrer = accounts[2];

        const EverGreen = await ethers.getContractFactory("EverGreen");
        const TetherToken = await ethers.getContractFactory("TetherToken");

        const tetherToken = await TetherToken.deploy(
            ethers.utils.parseUnits("10000", 6),
            "Tether USD",
            "USDT",
            6
        );

        await tetherToken.transfer(user.address, ethers.utils.parseUnits("100", 6));
        await tetherToken.transfer(
            referrer.address,
            ethers.utils.parseUnits("100", 6)
        );

        const everGreen = await EverGreen.deploy(
            owner.address,
            tetherToken.address
        );

        await tetherToken
            .connect(user)
            .approve(everGreen.address, ethers.utils.parseUnits("1000", 6));
        await tetherToken
            .connect(referrer)
            .approve(everGreen.address, ethers.utils.parseUnits("1000", 6));

        return { tetherToken, everGreen, owner, user, referrer };
    }

    it("Should deploy contract", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        expect(await everGreen.owner()).to.equal(owner.address);
    });

    it("Should register a user", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(1);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);
    });

    it("Should not allow registration with insufficient value", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await expect(
            everGreen
                .connect(referrer)
                .registrationExt(owner.address, ethers.utils.parseUnits("1", 6))
        ).to.be.revertedWith("registration cost 1 USDT");
    });

    it("Should not allow registration with invalid referrer", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await expect(
            everGreen
                .connect(referrer)
                .registrationExt(user.address, ethers.utils.parseUnits("2", 6))
        ).to.be.revertedWith("referrer not exists");
    });

    it("Should not allow duplicate registrations", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await expect(
            everGreen
                .connect(user)
                .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6))
        ).to.be.revertedWith("user exists");
    });

    it("Should buy level 2", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(2, ethers.utils.parseUnits("2", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(2);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);
    });

    it("Should buy level 3", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(3, ethers.utils.parseUnits("4", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(3);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);
    });

    it("Should buy level 4", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(4, ethers.utils.parseUnits("8", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(4);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);
    });

    it("Should buy level 5", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );
        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(5, ethers.utils.parseUnits("20", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(5);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);
    });

    it("Should buy level 6", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );
        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(6, ethers.utils.parseUnits("40", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(6);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);
    });

    it("Should not allow buying invalid levels", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await expect(
            everGreen
                .connect(user)
                .buyNewLevel(1, ethers.utils.parseUnits("1", 6))
        ).to.be.revertedWith("invalid level");
    });

    it("Should update E3 matrix correctly", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );
        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .buyNewLevel(2, ethers.utils.parseUnits("2", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(2);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);

        const referrerStruct = await everGreen.users(referrer.address);

        expect(referrerStruct.id).to.equal(2);
        expect(referrerStruct.partnercount).to.equal(1);
        expect(referrerStruct.maxlevel).to.equal(1);
        expect(referrerStruct.referrer).to.equal(owner.address);
        expect(referrerStruct.partnercount).to.equal(1);
    });

    it("Should update E4 matrix correctly", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );
        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .buyNewLevel(3, ethers.utils.parseUnits("4", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(3);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);

        const referrerStruct = await everGreen.users(referrer.address);

        expect(referrerStruct.id).to.equal(2);
        expect(referrerStruct.partnercount).to.equal(1);
        expect(referrerStruct.maxlevel).to.equal(1);
        expect(referrerStruct.referrer).to.equal(owner.address);
        expect(referrerStruct.partnercount).to.equal(1);
    });

    it("Should transfer payout to referrer", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(2, ethers.utils.parseUnits("2", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(2);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);

        const referrerStruct = await everGreen.users(referrer.address);

        expect(referrerStruct.id).to.equal(2);
        expect(referrerStruct.partnercount).to.equal(1);
        expect(referrerStruct.maxlevel).to.equal(1);
        expect(referrerStruct.referrer).to.equal(owner.address);
        expect(referrerStruct.partnercount).to.equal(1);

        const referrerBalance = await tetherToken.balanceOf(referrer.address);

        expect(referrerBalance).to.equal(ethers.utils.parseUnits("98", 6));
    });

    it("Should transfer payout to owner", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );

        const ownerBalanceBefore = await tetherToken.balanceOf(owner.address);
        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(2, ethers.utils.parseUnits("2", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(2);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);

        const referrerStruct = await everGreen.users(referrer.address);

        expect(referrerStruct.id).to.equal(2);
        expect(referrerStruct.partnercount).to.equal(1);
        expect(referrerStruct.maxlevel).to.equal(1);
        expect(referrerStruct.referrer).to.equal(owner.address);
        expect(referrerStruct.partnercount).to.equal(1);

        const ownerBalanceAfter = await tetherToken.balanceOf(owner.address);
        const ownerBalance = ownerBalanceAfter.sub(ownerBalanceBefore);

        expect(ownerBalance).to.equal(ethers.utils.parseUnits("6", 6));
    });

    it("Should transfer payout to referrer and owner", async function () {
        const { tetherToken, everGreen, owner, user, referrer } = await loadFixture(
            deployTokenFixture
        );
        const ownerBalanceBefore = await tetherToken.balanceOf(owner.address);
        await everGreen
            .connect(referrer)
            .registrationExt(owner.address, ethers.utils.parseUnits("2", 6));
        await everGreen
            .connect(user)
            .registrationExt(referrer.address, ethers.utils.parseUnits("2", 6));

        await everGreen
            .connect(user)
            .buyNewLevel(2, ethers.utils.parseUnits("2", 6));

        const userStruct = await everGreen.users(user.address);

        expect(userStruct.id).to.equal(3);
        expect(userStruct.partnercount).to.equal(0);
        expect(userStruct.maxlevel).to.equal(2);
        expect(userStruct.referrer).to.equal(referrer.address);
        expect(userStruct.partnercount).to.equal(0);

        const referrerStruct = await everGreen.users(referrer.address);

        expect(referrerStruct.id).to.equal(2);
        expect(referrerStruct.partnercount).to.equal(1);
        expect(referrerStruct.maxlevel).to.equal(1);
        expect(referrerStruct.referrer).to.equal(owner.address);
        expect(referrerStruct.partnercount).to.equal(1);

        const referrerBalance = await tetherToken.balanceOf(referrer.address);

        expect(referrerBalance).to.equal(ethers.utils.parseUnits("98", 6));

        const ownerBalanceAfter = await tetherToken.balanceOf(owner.address);
        const ownerBalance = ownerBalanceAfter.sub(ownerBalanceBefore);

        expect(ownerBalance).to.equal(ethers.utils.parseUnits("6", 6));
    });
});
