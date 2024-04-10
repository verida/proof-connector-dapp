import { Reclaim } from "@reclaimprotocol/js-sdk";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);

    const { app_id, provider_id } = body;
    const reclaimClient = new Reclaim.ProofRequest(app_id);
    const APP_SECRET = process.env.RECLAIM_SECRET_KEY;

    console.log('reclaim: ', app_id, provider_id, APP_SECRET)

    await reclaimClient.buildProofRequest(provider_id);

    reclaimClient.setSignature(
      await reclaimClient.generateSignature(APP_SECRET)
    );
    const { requestUrl, statusUrl } =
      await reclaimClient.createVerificationRequest();
    res.status(200).json({
      requestUrl,
      statusUrl,
    });
  } catch (err) {
    console.log("Error while reclaim verification: ", err);
    res.status(500).json(err);
  }
}
