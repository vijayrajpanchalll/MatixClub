# MatrixClub


## Table of Content

- [MatrixClub](#matrixclub)
  - [Table of Content](#table-of-content)
  - [Project Description](#project-description)
  - [Technologies Used](#technologies-used)
  - [A Typical Top-level Directory Layout](#a-typical-top-level-directory-layout)
  - [Install and Run](#install-and-run)

## Project Description

The MatrixClub project consists of a Solidity smart contract named MatrixClub.sol. This contract implements a matrix-based user structure with various functionalities, including user registration, level purchases, matrix updates, and payouts. The contract is also designed to be secure and audited.


## Technologies Used

- Solidity
- Hardhat
- Ethers.js

## A Typical Top-level Directory Layout

    .
    ├── contracts                   # Solidity contracts
    ├── scripts                     # Scripts to deploy and test contracts
    ├── test                        # Automated tests
    ├── .env                        # Environment variables
    ├── .gitignore                  # Files and directories ignored by git
    ├── .prettierrc                 # Prettier configuration
    ├── hardhat.config.js           # Hardhat configuration
    ├── package-lock.json           # Package lock file
    ├── package.json                # Node.js dependencies and scripts
    └── README.md                   # Project overview

## Install and Run

1. Clone the repo

```bash
git clone
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables

```bash
ALCHEMY_API_KEY=""
PRIVATE_KEY=""
ETHERSCAN_API_KEY=""
```

4. Compile contracts

```bash
npx hardhat compile
```

5. Deploy contracts

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

6. Run tests

```bash
npx hardhat test
```