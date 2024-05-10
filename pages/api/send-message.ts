import { generateVerifiableCredentials, getApplicationContext, sendMessage } from "../../utils";
import { NextApiRequest, NextApiResponse } from "next";
import { Schema } from "../../@types";
import os from 'os';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = JSON.parse(req.body);
    const { msg, veridaDid, schema } = body;

    const context = await getApplicationContext();

    if (context) {
      const credentials = await generateVerifiableCredentials(
        context,
        veridaDid,
        msg,
        schema as Schema
      );

      if (!credentials) {
        res.status(500).json("Cannot create Verida credentials");
        return;
      }

      const message = `New Credential Proof: ${(schema as Schema).host}`;
      
      console.log('credentials: ', credentials);

      // Change directory for temp files-tmp

      const result = await sendMessage(
        context,
        {
          message: credentials,
          messageSubject: message,
          targetDid: veridaDid,
          targetContext: "Verida: Vault"
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
    // res.status(500).end(err);
    throw new Error(err);
  }
}
