const { LitContracts } = require("@lit-protocol/contracts-sdk");
const u8a = require('@lit-protocol/uint8arrays')
const { keccak256 } = require("@ethersproject/keccak256");
const { ethers } = require("ethers");
const elliptic = require("elliptic");
const ec = new elliptic.ec("secp256k1");
exports.getPkpPublicKey = async (tokenId) => {
	const litContracts = new LitContracts();
	await litContracts.connect();
	const pkpPublicKey = await litContracts.pkpNftContract.read.getPubkey(tokenId);
	return pkpPublicKey
}

exports.getOwner = async (pkpPubKey) => {
	const pubkeyHash = keccak256(pkpPubKey);
    const tokenId = BigInt(pubkeyHash);

	const litContracts = new LitContracts();
	await litContracts.connect();
	const address = await litContracts.pkpNftContract.read.ownerOf(tokenId);

    return address;
}

exports.encodeDIDWithLit = (pkpPubKey) =>  {

	pkpPubKey = pkpPubKey.replace('0x', '')

	const pubBytes = ec
	.keyFromPublic(pkpPubKey, "hex")
	.getPublic(true, "array");

	const bytes = new Uint8Array(pubBytes.length + 2);

	bytes[0] = 0xe7;
	bytes[1] = 0x01;
	bytes.set(pubBytes, 2);
	
	const did = `did:key:z${u8a.uint8arrayToString(bytes, "base58btc")}`;

	return did;
}


            

module.exports.decodeDIDWithLit = (encodedDID) => { 

    const arr = encodedDID?.split(':');

    if(arr[0] != 'did') throw Error('string should start with did:');
    if(arr[1] != 'key') throw Error('string should start with did:key');
    if(arr[2].charAt(0) !== 'z') throw Error('string should start with did:key:z');

    const str = arr[2].substring(1);;

    const bytes = u8a.uint8arrayFromString(str, "base58btc");

    const originalBytes = new Uint8Array(bytes.length - 2);

    bytes.forEach((_, i) => {
        originalBytes[i] = bytes[i + 2];
    });

    const pubPoint = ec.keyFromPublic(originalBytes).getPublic();
    let pubKey = pubPoint.encode('hex', false);
    pubKey = pubKey.charAt(0) == '0' ? pubKey.substring(1) : pubKey;

    return '0x0' + pubKey;
}

exports.walletToDID = (chain, wallet) => {
	return `did:pkh:eip155:${parseInt(chain).toString()}:${wallet}`
}