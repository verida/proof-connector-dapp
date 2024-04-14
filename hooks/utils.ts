import { Credentials } from "@verida/verifiable-credentials";
import { Schema, ZkPassResult } from "../@types";
import { Context } from "@verida/client-ts";
export const generateVerifiableCredentials = async (context: Context, veridaDid: string, data: ZkPassResult, schema: Schema) => {
  // Note: `context` should already be obtained by connecting to the Verida Network
  const credentialSDK = new Credentials();

  // The Verida DID that is the subject of this credential (who is being verified with this credential?)
  // const veridaDid = 'did:vda:testnet:0x7c9699514D3e150e6F50d63345D4bD7B9831da7f';

  const credentialSchema =
    "https://common.schemas.verida.io/credential/zkpass/v0.1.0/schema.json";

  // Data for the credential that matches the credential schema
  const credentialData = {
    ...data,
    did: veridaDid,
    schema: credentialSchema
  };

  console.log('formated_data: ', credentialData)
  try {
    const credentialRecord = await credentialSDK.createVerifiableCredentialRecord(
      {
        context: context,
        data: credentialData,
        subjectId: veridaDid,
        schema: credentialSchema,
      },
      `zkPass credentials: ${schema.host}`, // name
      schema.description, // summary
    );
    return credentialRecord;;
  } catch (err) {
    console.log("error while generating credentials: ", err);
    return null;
  }
};
