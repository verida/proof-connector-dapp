import { NextRequest, NextResponse } from "next/server";
import { Client, Network } from "@verida/client-ts";
import { EnvironmentType, Web3CallType } from "@verida/types";
import { AutoAccount } from "@verida/account-node";
import { generateVerifiableCredentials } from "../../hooks/utils";

export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    // Create a connection to the network and open your context
    const VERIDA_ENVIRONMENT = EnvironmentType.TESTNET;
    const CONTEXT_NAME = "Dapp Connector";
    const PK = `0x${process.env.PRIVATE_KEY}`;
    const VERIDA_SEED = process.env.VERIDA_SEED;

    console.log("data: ", body.msg);

    // Configuration for the DID client
    // `privateKey` must be a Polygon private key that has enough
    // MATIC to perform a blockchain transaction to create your DID
    // (If it doesn't exist)
    const DID_CLIENT_CONFIG = {
      callType: "web3",
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
        body.veridaDid,
        body.msg
      );

      console.log("credentials: ", credentials);
      if (!credentials) {
        res.status(500).json("Cannot create Verida credentials");
        return;
      }

      const messaging = await context?.getMessaging();
      const type = "inbox/type/dataSend";

      const message = "zkPass result";

      const result = await messaging?.send(
        body.veridaDid,
        type,
        { data: [credentials] },
        message,
        {
          did: body.veridaDid,
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
