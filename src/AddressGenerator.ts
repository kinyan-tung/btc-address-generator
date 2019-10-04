const bitcoin = require("bitcoinjs-lib");
const bip32 = require('bip32');
const bip39 = require('bip39');

export class AddressGenerator {

  //use testnet as default network
  static DEFAULT_NETWORK: string = bitcoin.networks.bitcoin;

  static generateMultisigP2SHAddress(numOfSigns: number, publicKeyList: Array<string>): string {
    if(numOfSigns < 1){
      throw new Error('Number of signatures cannot less than 1');
    }
    if(!publicKeyList || publicKeyList.length===0){
      throw new Error('Please provide list of public keys');
    }
    if(publicKeyList.length < numOfSigns){
      throw new Error('Number of signatures cannot greater than number of public keys');
    }
    const pubkeys = publicKeyList.map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: numOfSigns, pubkeys }),
      }),
    });
    return address;
  }

  static generatePublicKey(network = AddressGenerator.DEFAULT_NETWORK): string {
    const privateKey = bitcoin.ECPair.makeRandom({network: network}).toWIF();
    const keyPair = bitcoin.ECPair.fromWIF(privateKey);
    return keyPair.publicKey.toString('hex'); // publicKey
  }

  static generateMnemonicAndSeed(): any{
    const mnemonic = bip39.generateMnemonic(256);
    const seedHex = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
    return {
      'mnemonic': mnemonic,
      'seedHex': seedHex
    }
  }

  static generateSegWitBySeedAndPath(seedHex: string, path: string, network = AddressGenerator.DEFAULT_NETWORK): string {
    if(!seedHex){
      throw new Error('Please provide seed hex');
    }
    if(!path){
      throw new Error('Please provide path');
    }
    // seed hex to buffer
    const seedBuffer = Buffer.from(seedHex, 'hex');
    const root = bip32.fromSeed(seedBuffer);
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2sh({
          redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: network }),
          network: network
    });
    return address;
  }
}
