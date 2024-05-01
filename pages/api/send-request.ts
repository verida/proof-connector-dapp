import { Server } from "socket.io";

import type { NextApiRequest, NextApiResponse } from "next";
import {
  REQUEST_VERIFICATION,
  USER_JOIN,
  VERIFICATION_RESULT,
  VERIFICATION_FAILED,
} from "../../constants/io_constants";
import {
  getApplicationContext,
  sendDataRequest,
  verifyReclaimProof,
  verifyZKProof,
} from "../../utils";
import {
  ReceivedMessage,
  SendDataRequestOptions,
  VerificationResult,
} from "../../@types";
import { VeridaCredentialRecord } from "@verida/verifiable-credentials";
import { CredentialSchema } from "../../config/providers";

export default async function ioHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const context = await getApplicationContext();
  if (!(res.socket as any).server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server((res.socket as any).server);

    io.on("connection", (socket) => {
      console.log(`${socket.id} connected`);

      // Join a conversation
      const { roomId, name } = socket.handshake.query;
      socket.join(roomId as string);

      io.in(roomId as string).emit(USER_JOIN, roomId);
      // Listen for new messages
      socket.on(REQUEST_VERIFICATION, async (data) => {
        // Do verification process
        const { body, veridaDid } = data;
        const msg = JSON.parse(body);
        console.log("received request from client: ", msg, veridaDid);

        try {
          const result = await sendDataRequest(
            context,
            veridaDid,
            msg as SendDataRequestOptions,
            async (data: ReceivedMessage<VeridaCredentialRecord>) => {
              console.log("data received: ", data, data?.data?.data);
              try {
                const proof = data.data.data?.[0];
                let verified = false;

                if (proof.credentialSchema === CredentialSchema.zkPass) {
                  console.log('zk verification start')
                  verified = verifyZKProof(proof);
                } else if (
                  proof.credentialSchema === CredentialSchema.reclaim
                ) {
                  console.log('reclaim verification start')
                  verified = await verifyReclaimProof(proof);
                }

                const verificationResult: VerificationResult = {
                  result: verified,
                  veridaDid,
                  credentialSchema: proof.credentialSchema,
                  credentialData: proof.credentialData,
                };

                io.in(roomId as string).emit(
                  VERIFICATION_RESULT,
                  verificationResult
                );
              } catch (err) {
                io.in(roomId as string).emit(VERIFICATION_FAILED, {
                  veridaDid,
                  error: err,
                });
              }
            }
          );
        } catch (error) {
          io.in(roomId as string).emit(VERIFICATION_FAILED, {
            veridaDid,
            error,
          });
        }
      });

      // Leave the room if the user closes the socket
      socket.on("disconnect", () => {
        socket.leave(roomId as string);
      });
    });

    (res.socket as any).server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
