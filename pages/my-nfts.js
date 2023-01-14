import axios from 'axios';
import { ethers } from 'hardhat';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Image from 'next/image';

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json';

export default function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    setLoading(true);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    const marketContract = new ethers.Contract(
      nftMarketAddress,
      KBMarket.abi,
      signer
    );
    const data = await marketContract.fetchMyNTFs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        // Get token metadata
        const meta = await axios.get(tokenUri);

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        };
        return item;
      })
    );
    setNfts(items);
    setLoading(false);
  }

  if (loading) return <h1 className="px-20 py-7 text-4xl">Loading...</h1>;

  if (!loading && !nfts.length)
    return <h1 className="px-20 py-7 text-4xl">You do not own any NFTs</h1>;

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '320px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => {
            return (
              <div
                key={nft.tokenId}
                className="border shadow rounded-xl overflow-hidden"
              >
                <Image src={nft.image} alt={`image${i}`} />
                <div className="pt-4">
                  <p className="h-16 text-3xl font-semibold">{nft.name}</p>
                  <div style={{ height: '72px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-3xl mb-4 font-bold text-white">
                    {nft.price} ETH
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
