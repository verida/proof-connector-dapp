"use client";
import { Status, useZkPass } from "../hooks/useZkPass";
import { useCallback, useEffect, useState } from "react";
import { schemas } from "../config/zk-schemas";
import { useRouter } from "next/router";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";

export default function ZkPassView() {
  const { verify, zkStatus, msgStatus } = useZkPass();
  const [zkAvailable, setZkAvailable] = useState(false);

  const router = useRouter();
  const _schemaId = router.query.schemaId;
  const _veridaDid = router.query.veridaDid;

  const [schemaId, setSchemaId] = useState(_schemaId || "");
  const [veridaDid, setVeridaDid] = useState(_veridaDid || "");

  useEffect(() => {
    setSchemaId(_schemaId);
    setVeridaDid(_veridaDid);

    if (_schemaId) {
      handleClick();
    }
  }, [_schemaId, _veridaDid]);

  useEffect(() => {
    (async () => {
      const connector = new TransgateConnect(ZKPASS_APP_ID);
      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable();
      setZkAvailable(isAvailable);
    })();
  }, []);

  const handleClick = useCallback(() => {
    if ((!schemaId || !veridaDid) && (!_veridaDid || !_schemaId)) {
      alert("SchemaId or VeridaDid is missing");
      return;
    }

    if (!zkAvailable) {
      alert("You need to install TransGate extension");
      return;
    }

    if (verify) {
      verify(schemaId, veridaDid);
    }
  }, [verify, schemaId, veridaDid]);

  const handleSchemaSelect = (_schemaId) => {
    setSchemaId(_schemaId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex-col"
        style={{ padding: "30px" }}
      >
        <button
          className="border-1 p-3 cursor-pointer"
          onClick={handleClick}
          disabled={
            !schemaId ||
            zkStatus === Status.Processing ||
            msgStatus === Status.Processing
          }
        >
          {zkStatus === Status.Processing ? "Processing..." : "Verify"}
        </button>
        {!schemaId && <p>Select schema to verify</p>}
        {zkStatus === Status.Processing && (
          <p>Waiting you to complete ZK verification...</p>
        )}
        {zkStatus === Status.Success && msgStatus === Status.Processing && (
          <p>Verification complete, sending proof...</p>
        )}
        {msgStatus === Status.Success && (
          <p>Proof sent! Check your Verida Wallet inbox</p>
        )}
        {zkStatus === Status.Failed && (
          <p className="bg-red-600 text-white mb-5 p-3 rounded-md">
            ZK Verification failed.
          </p>
        )}
        {msgStatus === Status.Failed && (
          <p className="bg-red-600 text-white mb-5 p-3 rounded-md">
            Sending Proof failed.
          </p>
        )}
        {!_schemaId && (
          <div className="schemas">
            <ul className="">
              {schemas.map((schema) => (
                <li
                  className={`mb-4 p-3 rounded-md cursor-pointer ${
                    schema.id == schemaId ? "bg-slate-500" : ""
                  }`}
                  key={schema.id}
                  onClick={() => handleSchemaSelect(schema.id)}
                  style={{ display: "flex", gap: "15px" }}
                >
                  <input
                    type="radio"
                    checked={schema.id === schemaId}
                    readOnly
                  />
                  <div>
                    <h3 className="text-[14px] text-black">{schema.title}</h3>
                    <p className="text-[12px] text-blue-900">
                      {schema.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
