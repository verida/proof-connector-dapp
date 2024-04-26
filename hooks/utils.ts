import { Credentials } from "@verida/verifiable-credentials";
import { ReclaimResult, Schema, ZkPassResult } from "../@types";
import { Context } from "@verida/client-ts";
import { CredentialSchema } from "../config/providers";
export const generateVerifiableCredentials = async (
  context: Context,
  veridaDid: string,
  data: ZkPassResult | ReclaimResult,
  schema: Schema
) => {
  // Note: `context` should already be obtained by connecting to the Verida Network
  const credentialSDK = new Credentials();

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
      ? `zkPass credentials: ${schema.host}`
      : `reclaim credentials: ${schema.host}`;
  try {
    const credentialRecord =
      await credentialSDK.createVerifiableCredentialRecord(
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
