import { ethers } from 'hardhat';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';

import { nftAddress, nftMarketAddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json';

const endpoint = 'https://ipfs.infura.io:5001/api/v0';
const ipfsURL = 'https://ipfs.infura.io/ipfs/';
const client = ipfsHttpClient(endpoint);

export default function MintItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: ''
  });
  const router = useRouter();

  const onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`receive: ${prog}`)
      });
      const url = `${ipfsURL}${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.error(error);
    }
  };

  const createMarket = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    const data = JSON.stringify({
      name,
      description,
      price,
      fileUrl
    });

    try {
      const added = await client.add(data);
      const url = `${ipfsURL}${added.path}`;
      createSale(url);
    } catch (error) {
      console.error(error);
    }
  };

  const createSale = async (url) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await contract.mintToken(url);
    let tx = await transaction.wait();
    let event = tx.event[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    contract = new ethers.Contract(nftMarketAddress, KBMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.makeMarketItem(nftAddress, tokenId, price, {
      value: listingPrice
    });
    await transaction.wait();
    router.push('/');
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          type="text"
          placeholder="Asset Name"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          type="text"
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Asset Price in ETH"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input
          type="file"
          name="asset"
          placeholder="Asset Price in ETH"
          className="mt-2 border rounded p-4"
          onChange={onChange}
        />
        {fileUrl && (
          <Image className="rounded mt-4 w-96" src="fileUrl" alt="asset" />
        )}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg"
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
