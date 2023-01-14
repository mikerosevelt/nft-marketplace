const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('KBMarket', function () {
  it('should mint and trade NFTs', async () => {
    // Test to receive contract addresses
    const Market = await ethers.getContractFactory('KBMarket');
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory('NFT');
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    // Test to receive listing price and auction price
    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    // Test for minting
    await nft.mintToken('https-t1');
    await nft.mintToken('https-t2');

    await market.makeMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice
    });
    await market.makeMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice
    });

    // Test for different addresses from different users - test accounts
    // return an array of however many addresses
    const [_, buyerAddress] = await ethers.getSigners();

    // create a market sale with address. id and price
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    const items = await market.fetchMarketTokens();

    // test out all the items
    console.log('items', items);
  });
});
