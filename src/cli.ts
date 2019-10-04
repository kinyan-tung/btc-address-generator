#!/usr/bin/env node
import { AddressGenerator } from './AddressGenerator';
import * as constants from './constants';
const yargs = require('yargs');

const argv = yargs
    .command(constants.GENERATE_N_OF_M_MULTISIG_P2SH, 'Generate n-out-of-m multisig P2SH bitcoin address, please input number of sign and public key(s)', (yargs: any) => {
        return yargs.option(constants.NUMBER_OF_SIGNATURES, {
            description: 'number of signatures',
            alias: 'n',
            type: 'number'
        }).option(constants.PUBLIC_KEYS, {
            description: 'list of public key(s), separate by comma(s)',
            alias: 'p',
            type: 'string',
        })
        .demandOption([constants.NUMBER_OF_SIGNATURES, constants.PUBLIC_KEYS], 'Please provide both number-of-signature and public-keys arguments to work with this tool')
        .coerce(constants.NUMBER_OF_SIGNATURES, (arg: number) => {
          if(arg < 1){
            throw new Error('Number of signatures cannot less than 1');
          }
          return Number(arg);
        })
        .coerce(constants.PUBLIC_KEYS, (arg: any) => {
           const pubkeys = arg.split(',');
           for(let pubkey of pubkeys){
             if(pubkey===''){
               throw new Error('Invalid public key');
             }
           }
           return pubkeys;
        });
    })
    .command(constants.DERIVE_HD_SEGWIT_BTC_ADDRESS, 'Derive an Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address, please input seed hex and path', (yargs: any) => {
        return yargs.option(constants.SEED_HEX, {
            description: "Wallet seed in Hexadecimal format",
            alias: 's',
            type: 'string'
        }).option(constants.PATH, {
            description: "e.g. m/49'/1'/0'/0/0",
            alias: 'p',
            type: 'string',
        })
        .demandOption([constants.SEED_HEX, constants.PATH], 'Please provide both seed and path arguments to work with this tool');
    })
    .command(constants.GENERATE_PUBLIC_KEYS, 'Generate public keys')
    .command(constants.GENERATE_MNEMONIC_SEED, 'Generate seed')
    .help('h')
    .alias('help', 'h')
    .argv;

// Generate n out of m multisig P2SH
if (argv._.includes(constants.GENERATE_N_OF_M_MULTISIG_P2SH)) {

  const numOfSigns = argv[constants.NUMBER_OF_SIGNATURES];
  const publicKeyList = argv[constants.PUBLIC_KEYS];

  console.log(`\nNumber of signatures: ${numOfSigns}`);
  console.log('List of public keys:');
  console.log(publicKeyList.join('\n'));

  try {
    const multisigAddress = AddressGenerator.generateMultisigP2SHAddress(numOfSigns, publicKeyList);
    console.log(`\nMultisig address: ${multisigAddress}\n`);
  } catch (exception) {
    if(exception instanceof Error){
      console.log(exception.message);
    } else {
      console.log('\nCannot generate Multisig address, please check your input.\n');
    }
  }
}

// Derive an Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address
if (argv._.includes(constants.DERIVE_HD_SEGWIT_BTC_ADDRESS)) {

  const seedHex = argv[constants.SEED_HEX];
  const path = argv[constants.PATH];

  console.log(`\nSeed Hex: ${seedHex}`);
  console.log(`Path: ${path}`);

  try {
    const segWitAddress = AddressGenerator.generateSegWitBySeedAndPath(seedHex, path);
    console.log(`\nSegWit BTC address: ${segWitAddress}\n`);
  } catch (exception) {
    if(exception instanceof Error){
      console.log(exception.message);
    } else {
      console.log('\nCannot generate SegWit BTC address, please check your input.\n');
    }
  }
}

// Generate public key for testing purpose only
if (argv._.includes(constants.GENERATE_PUBLIC_KEYS)) {
  console.log('\n'+AddressGenerator.generatePublicKey()+'\n');
}

// Generate mnemonic and seed purpose only
if (argv._.includes(constants.GENERATE_MNEMONIC_SEED)) {
  const {mnemonic, seedHex} = AddressGenerator.generateMnemonicAndSeed();
  console.log(`\nMnemonic: ${mnemonic}`);
  console.log(`Seed Hex: ${seedHex}\n`);
}
