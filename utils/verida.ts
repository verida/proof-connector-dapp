import {
  CreateCredentialJWT,
  Credentials,
  VERIDA_CREDENTIAL_SCHEMA,
  VeridaCredentialRecord,
} from "@verida/verifiable-credentials";
import {
  DataMessage,
  ReceivedMessage,
  ReclaimResult,
  Schema,
  SendDataMessageOptions,
  SendDataRequestData,
  SendDataRequestOptions,
  SendMessageData,
  SentMessage,
  VeridaMessageType,
  ZkPassResult,
} from "../@types";
import { Context, Network } from "@verida/client-ts";
import { CredentialSchema } from "../config/providers";
import { EnvironmentType, Web3CallType } from "@verida/types";
import { AutoAccount } from "@verida/account-node";

export const generateVerifiableCredentials = async (
  context: Context,
  veridaDid: string,
  data: ZkPassResult | ReclaimResult,
  schema: Schema
): Promise<VeridaCredentialRecord> => {
  // Note: `context` should already be obtained by connecting to the Verida Network
  // The Verida DID that is the subject of this credential (who is being verified with this credential?)
  // const veridaDid = 'did:vda:testnet:0x7c9699514D3e150e6F50d63345D4bD7B9831da7f';

  const credentialSchema = CredentialSchema[schema.src];
  // Data for the credential that matches the credential schema
  const credentialData = {
    ...data,
    id: veridaDid,
    schema: credentialSchema,
  };

  console.log("formated_data: ", credentialData);
  const name =
    schema.src === "zkPass"
      ? `zkPass proof: ${schema.message}`
      : `reclaim proof: ${schema.message}`;
  try {
    const credentialRecord =
      await createVerifiableCredentialRecord(
        {
          context: context,
          data: credentialData,
          subjectId: veridaDid,
          schema: credentialSchema,
        },
        name, // name
        schema.description // summary
      );
    return credentialRecord;
  } catch (err) {
    console.log("error while generating credentials: ", err);
    return null;
  }
};

/**
 * @dev This should be called from backend because it access to PK and SEED.
 * @returns The context of backend verida wallet.
 */
export const getApplicationContext = async (): Promise<Context> => {
  // Create a connection to the network and open your context
  const VERIDA_ENVIRONMENT =
    process.env.IS_DEV === "true"
      ? EnvironmentType.TESTNET
      : EnvironmentType.MAINNET;
  const CONTEXT_NAME = "Verida: Proof Connector";
  const PK = `0x${process.env.PRIVATE_KEY}`;
  const VERIDA_SEED = process.env.VERIDA_SEED;

  // Configuration for the DID client
  // `privateKey` must be a Polygon private key that has enough
  // MATIC to perform a blockchain transaction to create your DID
  // (If it doesn't exist)
  const DID_CLIENT_CONFIG = {
    callType: "web3" as Web3CallType,
    web3Config: {
      // Polygon private key
      privateKey: PK,
    },
  };
  return await Network.connect({
    context: {
      name: CONTEXT_NAME,
    },
    client: {
      environment: VERIDA_ENVIRONMENT,
    },
    account: new AutoAccount({
      privateKey: VERIDA_SEED, // or Verida mnemonic seed phrase
      environment: VERIDA_ENVIRONMENT,
      didClientConfig: DID_CLIENT_CONFIG,
    }),
  });
};

/**
 * @dev This should be called from backend
 * @param context Context where sends request from
 * @param did did where request is sent to
 * @param msg Requested msg
 * @returns result
 */
export const sendDataRequest = async (
  context: Context,
  did: string,
  msg: SendDataRequestOptions,
  callback: (data: ReceivedMessage<unknown>) => void
) => {
  console.log("user: ", did);
  if (!did) {
    throw Error("You have to pass did");
  }

  const messaging = await context.getMessaging();

  // setup a listener to show the response
  await messaging.onMessage(callback);

  const messageType = VeridaMessageType.DATA_REQUEST;
  const config = {
    did,
    recipientContextName: "Verida: Vault",
  };
  const dataToSend: SendDataRequestData = {
    requestSchema: msg.requestSchema,
    filter: msg.filter,
    userSelect: msg.userSelect,
    userSelectLimit: msg.userSelectLimit,
  };

  // This is the DID the message will go to
  // In this case it is the DID you are logged on here as
  const requestFromDID = did;

  const res = await messaging.send(
    requestFromDID,
    messageType,
    dataToSend,
    msg.messageSubject,
    config
  );
  console.log("Request sent");

  return res as SentMessage | null;
};

/**
 * @dev Send msg to verida wallet inbox
 */

export const sendMessage = async (
  context: Context,
  msg: SendDataMessageOptions
) => {
  console.log("user: ", msg.targetDid);
  if (!msg.targetDid) {
    throw Error("You have to pass did");
  }

  const messaging = await context.getMessaging();
  const type = VeridaMessageType.DATA_MESSAGE;

  const result = await messaging?.send(
    msg.targetDid,
    type,
    { data: [msg.message] },
    msg.messageSubject,
    {
      did: msg.targetDid,
      recipientContextName: msg.targetContext,
    }
  );

  return result as SentMessage | null;
};

async function createVerifiableCredentialRecord(
  createCredentialData: CreateCredentialJWT,
  name: string,
  summary?: string,
  icon?: string
): Promise<VeridaCredentialRecord> {
  const credentialSDK = new Credentials();
  const { vc, issuer } = await credentialSDK.buildVerifiableCredential(
    createCredentialData
  );
  const didJwtVc = await credentialSDK.createVerifiableCredential(vc, issuer);
  const decodedCredential = await credentialSDK.verifyCredential(didJwtVc);

  const credentialData = {
    ...decodedCredential.verifiableCredential,
    credentialSubject: {
      ...decodedCredential.verifiableCredential.credentialSubject,
      id: createCredentialData.subjectId
    }
  }
  return {
    name,
    summary,
    schema: VERIDA_CREDENTIAL_SCHEMA,
    credentialData: credentialData,
    credentialSchema: createCredentialData.schema,
    icon,
    didJwtVc,
  };
}
