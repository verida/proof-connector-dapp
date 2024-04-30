import { useEffect, useRef, useState } from "react";
import { SendDataRequestOptions, VerificationResult } from "../@types";
import { CredentialSchema } from "../config/providers";
import { Socket, io } from "socket.io-client";
import {
  REQUEST_VERIFICATION,
  USER_JOIN,
  VERIFICATION_RESULT,
} from "../constants/io_constants";

export default function useVerify() {
  const socketRef = useRef<Socket>();
  const [isVerifying, setVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult>();

  const requestVerification = async (did: string) => {
    if (!socketRef.current) {
      await registerSocket(did);
      return;
    }

    setVerifying(true);

    const msg: SendDataRequestOptions = {
      requestSchema: CredentialSchema.baseCredential,
      filter: {
        $or: Object.entries(CredentialSchema).map(([src, url]) => ({
          credentialSchema: url,
        })),
      },
      userSelect: true,
      messageSubject: "Please select your verifiable credential to verify",
    };

    socketRef.current.emit(REQUEST_VERIFICATION, {
      body: JSON.stringify(msg),
      veridaDid: did,
    });
  };

  // register socket handler
  const registerSocket = async (did: string) => {
    fetch("/api/send-request").finally(() => {
      socketRef.current = io({
        query: { roomId: did, name: "testName" },
      });

      socketRef.current.on("connect", () => {
        console.log("connected: ", socketRef.current.id);
      });

      socketRef.current.on(USER_JOIN, (roomId: string) => {
        console.log("user joint: ", roomId);
      });

      socketRef.current.on(VERIFICATION_RESULT, (res: string) => {
        console.log("verification result: ", res);
        setVerificationResult(JSON.parse(res));
        setVerifying(false);
      });
    });
  };

  return {
    requestVerification,
    registerSocket,
    isVerifying,
    verificationResult,
  };
}
