import bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

// 显式初始化 ECC 库
bitcoin.initEccLib(ecc);

// 初始化 bip32
const bip32 = BIP32Factory(ecc);

// 使用比特币主网
const network = bitcoin.networks.bitcoin;

// 示例 xprv 主私钥 (仅供测试，请勿用于实际交易)
const xprv = 'xprvA2rq8PAb5nCHJZfTQmojWe2ZLxMJLgCUHiVEuUhJGGXyoSTo9a8mAmYByeWaAZj5B2WhfkFv4HaqNkr9kafHqH7Yfrjf86f29Q3vEnnpnrT';

// 使用 BIP32 导入扩展私钥
const childNode = bip32.fromBase58(xprv, network);

// 输出16进制格式的私钥
if (childNode.privateKey) {
    const privateKeyHex = Buffer.from(childNode.privateKey).toString('hex');
    console.log("私钥 (Private Key in Hex):", `0x${privateKeyHex}`);
} else {
    console.error("无法提取私钥 (Private key not available)");
}

// 输出深度信息
console.log("深度 (Depth):", childNode.depth);
console.log("父密钥指纹 (Parent Fingerprint):", childNode.parentFingerprint.toString(16));
console.log("链码 (Chain Code):", Buffer.from(childNode.chainCode).toString('hex'));
console.log("是否为主密钥 (Is Master Key):", childNode.depth === 0);

// Taproot 地址需要压缩公钥 (33字节)
const publicKeyBuffer = Buffer.from(childNode.publicKey);

// 扩展公钥 (xpub)
console.log("扩展公钥 (xpub): ", childNode.neutered().toBase58());

// 生成 BIP86 (Taproot) 原生隔离见证地址 (bc1p)
const { address } = bitcoin.payments.p2tr({
    internalPubkey: publicKeyBuffer.slice(1, 33),
    network
});

// 输出生成的 Bech32 地址
console.log("生成的 Bech32m 地址: ", address);

console.log("\n");
const xpub = 'xpub6FrBXthUv9kaX3jvWoLjsmyHtzBnk8vKewQqhs6upc4xgEnwh7T1iZrfpu6RhxPpqQCoG7pbmh5fhoMiQhvERRai1E1sSGsMqZ9FnW8z6Ai'; 
const xpubNode = bip32.fromBase58(xpub, network);
const publicKeyBuffer2 = Buffer.from(xpubNode.publicKey);
const p2trAddressObject = bitcoin.payments.p2tr({
    internalPubkey: publicKeyBuffer2.slice(1, 33),  
    network
});

// 正确访问地址字段
console.log("根据 xpub 生成的 Bech32m 地址: ", p2trAddressObject.address);