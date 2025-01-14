import bitcoin from 'bitcoinjs-lib';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';

bitcoin.initEccLib(ecc);

const bip32 = BIP32Factory(ecc);

const network = bitcoin.networks.bitcoin;

const xprv = 'xprv9s21ZrQH143K3xD1YFGTdtHTp4PPQ8f4C1YXGQpQXVSojCe2W5WmnDhy3KndxzTWbLwGjGEV5HmSamFiubqhiLUnyouhSoEEpNTVfTHX56c';

const rootNode = bip32.fromBase58(xprv, network);

const derivedNode = rootNode.derivePath("m/44/0/0/0/1");

const publicKeyBuffer = Buffer.from(derivedNode.publicKey);

const derivedPrivateKeyHex = Buffer.from(derivedNode.privateKey).toString('hex');

const { address: taprootAddress } = bitcoin.payments.p2tr({
    internalPubkey: publicKeyBuffer.slice(1, 33), 
    network
});

console.log("派生私钥 (Hex):", `0x${derivedPrivateKeyHex}`);
console.log("派生公钥 (Hex):", publicKeyBuffer.toString('hex'));
console.log("生成的 Taproot 地址 (bc1p):", taprootAddress);
