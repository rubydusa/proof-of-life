# Proof of Life: Zero-Knowledge-Proof Implementation of Conway's Game of Life

[Medium article on the project](https://medium.com/coinmonks/proof-of-life-zero-knowledge-proof-implementation-of-conways-game-of-life-with-circom-and-6438521fb2b1) \
[Website](https://proof-of-life.netlify.app/)

Conway's Game of Life implementation in Circom, usage demonstration with an NFT contract, and a React application that uses SnarkJS

## Dependencies
In order to run the project you need to [Install Circom](https://docs.circom.io/getting-started/installation/)

## Cloning The Project

```
> git clone https://github.com/rubydusa/proof-of-life
> cd proof-of-life
> npm i
> cd front
> npm i
```
If you want to deploy the contracts to goerli you need to configure a `.env` file:
```
DEPLOYER_KEY="<deployer key here>"
GOERLI_RPC="<goerli rpc>"
```
### Running tests:
```
> npx hardhat test
```

### Running the frontend (need to be in `front` directory)
```
> npm run start
```