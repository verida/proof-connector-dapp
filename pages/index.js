"use client";
import { Status, useVerify } from "../hooks/useVerify";
import { useCallback, useEffect, useState } from "react";
import { schemas } from "../config/zk-schemas";
import { useRouter } from "next/router";

export default function Home() {
  const { verify, status } = useVerify();

  const router = useRouter();
  const _schemaId = router.query.schemaId;
  const _veridaDid = router.query.veridaDid;

  const [schemaId, setSchemaId] = useState(_schemaId || "");
  const [veridaDid, setVeridaDid] = useState(_veridaDid || "");

  useEffect(() => {
    setSchemaId(_schemaId);
    setVeridaDid(_veridaDid);
  }, [_schemaId, _veridaDid]);

  const handleClick = useCallback(() => {
    if (!schemaId || !veridaDid) {
      alert("SchemaId or VeridaDid is missing");
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
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex-col" style={{padding: '30px'}}>
        <button
          className="border-1 p-3 cursor-pointer"
          onClick={handleClick}
          disabled={!schemaId || status === Status.Processing}
        >
          {status === Status.Processing ? "Processing..." : "Continue"}
        </button>
        {status === Status.Failed && (
          <p className="bg-red-600 text-white mb-5 p-3 rounded-md">
            Verification failed.
          </p>
        )}
        {status === Status.Success && (
          <p className="bg-green-500 mb-5 p-3 rounded-sm">
            Verified successfully.
          </p>
        )}
        <div className="schemas">
          <ul className="">
            {schemas.map((schema) => (
              <li
                className={`mb-4 p-3 rounded-md cursor-pointer ${
                  schema.id == schemaId ? "bg-slate-500" : ""
                }`}
                key={schema.id}
                onClick={() => handleSchemaSelect(schema.id)}
                style={{display: "flex", gap: "15px"}}
              >
                <input type="radio" checked={schema.id === schemaId} />
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
      </div>
    </main>
  );
}
