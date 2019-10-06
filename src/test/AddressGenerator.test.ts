import { AddressGenerator } from '../AddressGenerator';
const typeforce = require('typeforce');
const bip39 = require('bip39');

test('generate 2 of 4 Multisig P2SH Address', () => {
  const publicKeyList = [
    '034246130970bad2bcc24331c88c33476bab3f70051c1f74d80e07c644ea146026',
    '022e56d85e214480de72de7d888ec027db1171361f44ce5fe9141cf34aa2e6ee73',
    '026c749a23e76a436bc0d2300e158df62aee243fe932c8dcd277e455a08252ca91',
    '036320bc6300948039141a5945126d6ee2b462c7b5344af0934b33eb3ac6a0b5d6'
  ];
  const multisig = AddressGenerator.generateMultisigP2SHAddress(2, publicKeyList);
  expect(multisig).toBe('3DKft7bT9bBcepAFGNZca7NdPc2eYMY4DZ');
});

test('generate Multisig P2SH Address with invalid number of signs', () => {
  const publicKeyList = [
    '034246130970bad2bcc24331c88c33476bab3f70051c1f74d80e07c644ea146026',
    '022e56d85e214480de72de7d888ec027db1171361f44ce5fe9141cf34aa2e6ee73',
    '026c749a23e76a436bc0d2300e158df62aee243fe932c8dcd277e455a08252ca91',
    '036320bc6300948039141a5945126d6ee2b462c7b5344af0934b33eb3ac6a0b5d6'
  ];
  function zeroSigns(){
    AddressGenerator.generateMultisigP2SHAddress(0, publicKeyList);
  }
  function negativeOneSigns(){
    AddressGenerator.generateMultisigP2SHAddress(-1, publicKeyList);
  }
  function greaterThan5Signs(){
    AddressGenerator.generateMultisigP2SHAddress(5, publicKeyList);
  }
  expect(zeroSigns).toThrowError(Error);
  expect(negativeOneSigns).toThrowError(Error);
  expect(greaterThan5Signs).toThrowError(Error);
});

test('generate Multisig P2SH Address with invalid public key', () => {
  const publicKeyList = [
    '034246130970bad2bcc24331c88c33476bab3f70051c1f74d80e07c644ea146026',
    'xxxx',
  ];
  function invalidPublicKey(){
    AddressGenerator.generateMultisigP2SHAddress(0, publicKeyList);
  }
  expect(invalidPublicKey).toThrowError(Error);
});

test('generate Multisig P2SH Address without public keys', () => {
  function withoutPublicKey(){
    AddressGenerator.generateMultisigP2SHAddress(1, []);
  }
  expect(withoutPublicKey).toThrowError(Error);
});

test('generate SegWit by seed and path', () => {
  const segWit = AddressGenerator.generateSegWitBySeedAndPath('e7a5ad8f219e14c8345d2a3794898e7a1407e8be919131ef6f149d5a755d5d78a1e6af236ed3c865deb39447792d681eec8cd6ae4daa28b1aa5a81da093fdb1f', "m/48'/1'/0'/0/0");
  expect(segWit).toBe('3AH4VRvC8uunEy7mtgzH7xeBW48TY3QGf1');
});

test('generate SegWit with invalid path', () => {
  function invalidPath(){
    AddressGenerator.generateSegWitBySeedAndPath('e7a5ad8f219e14c8345d2a3794898e7a1407e8be919131ef6f149d5a755d5d78a1e6af236ed3c865deb39447792d681eec8cd6ae4daa28b1aa5a81da093fdb1f', "x");
  }
  const typeError = new typeforce.TfTypeError("BIP32Path", "x");
  expect(invalidPath).toThrowError(typeError);
});

test('generate public key', () => {
  const publicKey = AddressGenerator.generatePublicKey();
  expect(publicKey).not.toBeNull();
});

test('generate mnemonic and seed', () => {
  const {mnemonic, seed} = AddressGenerator.generateMnemonicAndSeed();
  expect(bip39.validateMnemonic(mnemonic)).toBeTruthy();
  expect(seed).not.toBeNull();
});
