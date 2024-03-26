"use client";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";
import { useState } from "react";

export const Status = {
  None: 0,
  Success: 1,
  Processing: 2,
  Failed: 3,
}

export const useVerify = () => {
  const [status, setStatus] = useState(Status.None);

  const verify = async (schemaId, veridaDid) => {
    try {
      setStatus(Status.Processing);

      // Create the connector instance
      const connector = new TransgateConnect(ZKPASS_APP_ID);

      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable();

      if (isAvailable) {
        // The schema id of the project

        // Launch the process of verification
        // This method can be invoked in a loop when dealing with multiple schemas
        const res = await connector.launch(schemaId);

        const result = await fetch("/api/verify", {
          method: "POST",
          body: JSON.stringify({
            result: res,
            veridaDid,
          }),
        });
        console.log("res: ", result);
        setStatus(Status.Success);
        // verify the res onchain/offchain based on the requirement
      } else {
        alert(`Please install TransGate extension - https://chromewebstore.google.com/detail/zkpass-transgate/afkoofjocpbclhnldmmaphappihehpma`);
        setStatus(Status.Failed);
      }
    } catch (error) {
      console.log("transgate error", error);
      setStatus(Status.Failed);
    }
  };

  return { verify, status };
};
