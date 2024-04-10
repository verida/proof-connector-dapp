import { useCallback, useEffect, useState } from "react";
import { RECLAIM_APP_ID } from "../config/config";

export const useReclaim = (provider_id: string) => {
  const [requestUrl, setRequestUrl] = useState<string>("");
  const [statusUrl, setStatusUrl] = useState<string>("");

  const [statusTxt, setStatusTxt] = useState<string>("");
  let intervalId: NodeJS.Timer;

  useEffect(() => {
    (async () => {
      setStatusTxt("Generating verification link");
      const res = await fetch("/api/reclaim-verification", {
        method: "POST",
        body: JSON.stringify({
          app_id: RECLAIM_APP_ID,
          provider_id: provider_id,
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
  }, [provider_id]);

  async function sendMessage(veridaDid: string, msg: any) {
    const res = await fetch("/api/send-message", {
      method: "POST",
      body: JSON.stringify({
        msg,
        veridaDid,
      }),
    });

    if (res.status === 200) {
      return res;
    } else {
      throw new Error(`Verida Message Error`);
    }
  }

  const startVerification = useCallback(
    (veridaDid: string) => {
      clearInterval(intervalId);
      if (statusUrl) {
        intervalId = setInterval(async () => {
          setStatusTxt("Waiting to generate proof..");
          fetch(statusUrl)
            .then(async (res) => {
              const data = await res.json();
              console.log("status: ", data);
              if (data.session.status == "Ok") {
                const context = data.session.proofs[0].claimData.context;
                console.log("context: ", context);
                clearInterval(intervalId);

                setStatusUrl(
                  "Generated proof. Sending message to verida app..."
                );

                if (context) {
                  try {
                    await sendMessage(veridaDid, context);
                    setStatusTxt("Message sent!");
                  } catch (err) {
                    console.log("Verida Message error: ", err);
                    setStatusTxt("Message sent failed.");
                  }
                }
              }
            })
            .catch((err) => {
                console.log('error in generating proof: ', err);
              setStatusUrl("Failed to generate proof");
            });
        }, 3000);
      }
      return () => clearInterval(intervalId);
    },
    [statusUrl, requestUrl]
  );

  return { requestUrl, statusUrl, startVerification, statusTxt };
};
