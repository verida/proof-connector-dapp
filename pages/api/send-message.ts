import { NextRequest, NextResponse } from "next/server";
import { Client, Network } from "@verida/client-ts";
import { EnvironmentType, Web3CallType } from "@verida/types";
import { AutoAccount } from "@verida/account-node";
import { generateVerifiableCredentials } from "../../hooks/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = JSON.parse(req.body);
    const { msg, veridaDid, schema } = body;
    // Create a connection to the network and open your context
    const VERIDA_ENVIRONMENT =
      process.env.IS_DEV === "true"
        ? EnvironmentType.TESTNET
        : EnvironmentType.MAINNET;
    const CONTEXT_NAME = "Dapp Connector";
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

    const context = await Network.connect({
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

    if (context) {
      const credentials = await generateVerifiableCredentials(
        context,
        veridaDid,
        msg,
        schema
      );

      console.log("credentials: ", credentials);
      if (!credentials) {
        res.status(500).json("Cannot create Verida credentials");
        return;
      }

      const messaging = await context?.getMessaging();
      const type = "inbox/type/dataSend";

      const message = `zkPass credential: ${schema.host}`;

      const result = await messaging?.send(
        veridaDid,
        type,
        { data: [credentials] },
        message,
        {
          did: veridaDid,
          recipientContextName: "Verida: Vault",
        }
      );

      console.log("Sent : ", result);
      res.status(200).json(result);
      await context.close();
    } else {
      res.status(500).json("Cannot create Verida Context");
    }
  } catch (err) {
    console.log("Error while messaging: ", err);
    res.status(500).json(err);
  }
}
