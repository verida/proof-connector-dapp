import Credentials from "@verida/verifiable-credentials";
export const generateVerifiableCredentials = async (context, veridaDid) => {
  // Note: `context` should already be obtained by connecting to the Verida Network
  const credentialSDK = new Credentials();

  // The Verida DID that is the subject of this credential (who is being verified with this credential?)
  // const veridaDid = 'did:vda:testnet:0x7c9699514D3e150e6F50d63345D4bD7B9831da7f';

  const credentialSchema =
    "https://common.schemas.verida.io/credential/zkpass/v0.1.0/schema.json";

  // Data for the credential that matches the credential schema
  const credentialData = {
    finClusiveId: "12345",
    gender: "male",
    firstName: "Chris",
    lastName: "Tester",
    streetAddress1: "123 Four Ave",
    suburb: "Adelaide",
    state: "SA",
    postcode: "5000",
    dateOfBirth: "2000-01-01",
  };

  const title = "KYC Credential";
  const summary = "Credential issued by <signer> on <date>";
  const options = {};
  try {
    const credentialRecord = await credentialSDK.createVerifiableCredentialRecord(
      {
        context: context,
        data: credentialData,
        subjectId: veridaDid,
        schema: credentialSchema,
        options,
      },
      title,
      summary
    );
    return credentialRecord;;
  } catch (err) {
    console.log("error while generating credentials: ", err);
    return {};
  }
};
