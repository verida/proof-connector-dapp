import { useCallback, useEffect, useState } from "react";
import { RECLAIM_APP_ID } from "../config/config";
import { Status } from "./useZkPass";
import { Schema, ZkPassResult } from "../@types";

export const useReclaim = (schema: Schema) => {
  const [requestUrl, setRequestUrl] = useState<string>("");
  const [statusUrl, setStatusUrl] = useState<string>("");

  const [statusTxt, setStatusTxt] = useState<string>("");
  const [zkStatus, setZkStatus] = useState<number>(Status.None);
  const [msgStatus, setMsgStatus] = useState<number>(Status.None);

  let intervalId: NodeJS.Timer;

  useEffect(() => {
    (async () => {
      if (!schema || schema.src !== "reclaim") return;
      setStatusTxt("Generating verification link");
      const res = await fetch("/api/reclaim-verification", {
        method: "POST",
        body: JSON.stringify({
          app_id: RECLAIM_APP_ID,
          provider_id: schema.id,
        }),
      });

      if (res.status == 200) {
        const data = await res.json();
        console.log("data: ", data);
        setRequestUrl(data.requestUrl);
        setStatusUrl(data.statusUrl);
        setStatusTxt("Generated verification link successfully.");
      } else {
        setStatusTxt("Failed generatig verification link.");
      }
    })();
  }, [schema]);

  async function sendMessage(
    veridaDid: string,
    msg: ZkPassResult,
    schema: Schema
  ) {
    const res = await fetch("/api/send-message", {
      method: "POST",
      body: JSON.stringify({
        msg,
        veridaDid,
        schema,
      }),
    });

    if (res.status === 200) {
      return res;
    } else {
      throw new Error(`Verida Message Error`);
    }
  }

  const startVerification = useCallback(
    (veridaDid: string, schema: Schema) => {
      setZkStatus(Status.None);
      setMsgStatus(Status.None);

      clearInterval(intervalId);
      if (statusUrl) {
        intervalId = setInterval(async () => {
          setStatusTxt("Waiting to generate proof..");
          setZkStatus(Status.Processing);
          fetch(statusUrl)
            .then(async (res) => {
              const data = await res.json();
              console.log("status: ", data);
              if (data.session.status == "Ok") {
                const context = data.session.proofs[0].claimData.context;
                console.log("context: ", context);
                clearInterval(intervalId);
                setZkStatus(Status.Success);

                setStatusUrl(
                  "Generated proof. Sending message to verida app..."
                );

                if (context) {
                  try {
                    setMsgStatus(Status.Processing);
                    await sendMessage(veridaDid, context, schema);
                    setStatusTxt("Message sent!");
                    setMsgStatus(Status.Success);
                  } catch (err) {
                    console.log("Verida Message error: ", err);
                    setStatusTxt("Message sent failed.");
                    setMsgStatus(Status.Failed);
                  }
                }
              }
            })
            .catch((err) => {
              console.log("error in generating proof: ", err);
              setStatusUrl("Failed to generate proof");
              setZkStatus(Status.Failed);
            });
        }, 3000);
      }
      return () => clearInterval(intervalId);
    },
    [statusUrl, requestUrl]
  );

  return {
    requestUrl,
    statusUrl,
    startVerification,
    statusTxt,
    zkStatus,
    msgStatus,
  };
};
