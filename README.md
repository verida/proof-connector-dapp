
## Verida Dapp connector 

This application directs a user to generate a zero knowledge proof (using [zkPass](https://zkpass.org/) or [Reclaim protocol](https://reclaimprotocol.org/)) of something on an external website. This proof is then sent to the user’s Verida Wallet using the Verida inbox messaging system.

## Usecase Examples
- Verify if you exceed trading volume on Binance
- Verify if you are discord owner
- Verify if you have Uber account
- Verify credentials from zkPass and Reclaim protocol

## Setup
### Setup zkPass account
- Follow [this](https://zkpass.gitbook.io/zkpass/developer-guides/quick-start) instructions 
- Create new application and register necessary [schemas](https://zkpass.gitbook.io/zkpass/developer-guides/schema) .
- Get `APP_ID`
- In `src/config/providers.ts` update schemas with your own schemas.
- Update `NEXT_PUBLIC_ZKPASS_APP_ID` in .env file.

### Setup Reclaim account
- Go to https://dev.reclaimprotocol.org/dashboard
- Create new app and register necessary providers
- In `src/config/providers.ts` update provider data with your own providers.
- Update `NEXT_PUBLIC_RECLAIM_APP_ID` in .env file
- Update `RECLAIM_SECRET_KEY` in .env file

### Add PRIVATE_KEY to send message through Verida messaging system
- Update `PRIVATE_KEY` in .env file.

### Add VERIDA_SEED to send message through Verida messaging system. You get this from Verida Wallet.
- Update `VERIDA_SEED` in .env file

## Run
```
yarn install
yarn build
yarn start
```
- http://localhost:3000/add-credential?schemaId=[schemaId]&veridaDid=[veridaDid]

- http://localhost:3000/add-credential?veridaDid=[veridaDid]
```

## Verify credentials from zkPass and reclaim protocol.
- Open `http://localhost:3000/verify
- Connect to your verida wallet
- Click `Request credential`

### How it works?
The system initiates a data request to the connected wallet's inbox. Upon the user providing their credentials, the backend system proceeds to authenticate the validity of the credentials, based on the credential types such as zkPass or reclaim.


## Deployment

We deploy using AWS Amplify. Make sure all env variables are set in the Amplify console and added into amplify.yml for serverside rendering.

Eg:
```
      commands:
        - env | grep -e NEXT_PUBLIC_ZKPASS_APP_ID -e PRIVATE_KEY -e NEXT_PUBLIC_RECLAIM_APP_ID -e RECLAIM_SECRET_KEY -e VERIDA_SEED >> .env

```

See https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html