
## Verida Dapp connector 

This application directs a user to generate a zero knowledge proof (using [zkPass](https://zkpass.org/) or [Reclaim protocol](https://reclaimprotocol.org/)) of something on an external website. This proof is then sent to the user’s Verida Wallet using the Verida inbox messaging system.

## Usecase Examples
- Verify if you exceed trading volume on Binance
- Verify if you are discord owner
- Verify if you have Uber account

## Setup
### Setup zkPass account
- Follow [this](https://zkpass.gitbook.io/zkpass/developer-guides/quick-start) instructions 
- Create new application and register necessary [schemas](https://zkpass.gitbook.io/zkpass/developer-guides/schema) .
- Get `APP_ID`
- In `src/config/zk-schema.js` update schemas with your own schemas.
- Update `NEXT_PUBLIC_ZKPASS_APP_ID` in .env file.

### Setup Reclaim account
- Go to https://dev.reclaimprotocol.org/dashboard
- Create new app and register necessary providers
- In `src/reclaim-providers.js` update provider data with your own providers.
- Update `NEXT_PUBLIC_RECLAIM_APP_ID` in .env file
- Update `RECLAIM_SECRET_KEY` in .env file

### Add private key to send message through Verida messaging system
- Update `PRIVATE_KEY` in .env file.

## Run
```
npm i
npm run start
```
- Using zkPass
```
http://localhost:3000/zkpass?schemaId=[schemaId]&veridaDid=[veridaDid]
Or
http://localhost:3000/zkpass?veridaDid=[veridaDid]
```
- Using Reclaim
```
http://localhost:3000/reclaim?schemaId=[schemaId]&veridaDid=[veridaDid]
Or
http://localhost:3000/reclaim?veridaDid=[veridaDid]
```
