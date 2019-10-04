# btc-address-generator
A javascript library for node.js to generate Hierarchical Deterministic (HD) Segregated Witness (SegWit) and n-out-of-m Multisignature (multisig) Pay-To-Script-Hash (P2SH) btc address.

## Compilation
``` bash
npm run tsc
```

## Usage

### Please use below as testing purpose only

#### 1. Generate public key
``` bash
node build/cli.js generate-public-key
```

#### 2. Generate mnemonic and seed
``` bash
node build/cli.js generate-mnemonic-seed
```

#### 3. Derive an Hierarchical Deterministic (HD) Segregated Witness (SegWit) bitcoin address from a given seed and path
``` bash
node build/cli.js derive-HD-SegWit-BTC-address -s e7a5ad8f219e14c8345d2a3794898e7a1407e8be919131ef6f149d5a755d5d78a1e6af236ed3c865deb39447792d681eec8cd6ae4daa28b1aa5a81da093fdb1f -p "m/49'/1'/0'/0/0"
```

#### 4. Generate an n-out-of-m Multisignature (multisig) Pay-To-Script-Hash (P2SH) bitcoin address, where n and addresses can be specified
``` bash
node build/cli.js generate-n-of-m-multisig-P2SH -n 3 -p 034246130970bad2bcc24331c88c33476bab3f70051c1f74d80e07c644ea146026,022e56d85e214480de72de7d888ec027db1171361f44ce5fe9141cf34aa2e6ee73,026c749a23e76a436bc0d2300e158df62aee243fe932c8dcd277e455a08252ca91,036320bc6300948039141a5945126d6ee2b462c7b5344af0934b33eb3ac6a0b5d6
```

## Running the test suite
``` bash
npm test
```
