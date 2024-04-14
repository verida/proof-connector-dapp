"use client";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";
import { useState } from "react";
import { schemas } from "../config/providers";
import { Schema, ZkPassResult } from "../@types";

export const Status = {
  None: 0,
  Success: 1,
  Processing: 2,
  Failed: 3,
};

async function processZK(schemaId: string): Promise<ZkPassResult> {
  // Create the connector instance
  const connector = new TransgateConnect(ZKPASS_APP_ID);
  // Check if the TransGate extension is installed
  // If it returns false, please prompt to install it from chrome web store
  const isAvailable = await connector.isTransgateAvailable();
  if (isAvailable) {
    const res = await connector.launch(schemaId);

    return res as ZkPassResult;
  } else {
    throw new Error("You need to install ZKPass extension");
  }
}

async function sendMessage(veridaDid: string, msg: ZkPassResult, schema: Schema) {
  const res = await fetch("/api/send-message", {
    method: "POST",
    body: JSON.stringify({
      msg,
      veridaDid,
      schema
    }),
  });

  if (res.status === 200) {
    return res;
  } else {
    throw new Error(`Verida Message Error`);
  }
}

export const useZkPass = () => {
  const [zkStatus, setZkStatus] = useState<number>(Status.None);
  const [msgStatus, setMsgStatus] = useState<number>(Status.None);

  const verify = async (schema: Schema, veridaDid: string) => {
    setZkStatus(Status.None);
    setMsgStatus(Status.None);

    let msg: ZkPassResult;
    try {
      setZkStatus(Status.Processing);
      msg = await processZK(schema.id);
      setZkStatus(Status.Success);
    } catch (err) {
      console.log("zk error: ", err);
      setZkStatus(Status.Failed);
    }

    if (msg) {
      try {
        setMsgStatus(Status.Processing);
        await sendMessage(veridaDid, {
          ...msg,
          zkPassSchemaId: schema.id,
          zkPassSchemaLabel: schema.title || "No label"
        }, schema);
        setMsgStatus(Status.Success);
      } catch (err) {
        console.log("Verida Message error: ", err);
        setMsgStatus(Status.Failed);
      }
    }
  };

  return { verify, zkStatus, msgStatus };
};
