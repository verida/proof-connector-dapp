"use client";
import { Status, useZkPass } from "../hooks/useZkPass";
import { useCallback, useEffect, useState } from "react";
import { schemas } from "../config/zk-schemas";
import { useRouter } from "next/router";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";
import { Sora } from "next/font/google";
import { Header } from "../components/layouts/header";
import { Footer } from "../components/layouts/Footer";
import VerificationModal from "../components/layouts/VerificationModal";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

export default function ZkPassView() {
  const { verify, zkStatus, msgStatus } = useZkPass();
  const [zkAvailable, setZkAvailable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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
    setModalOpen(true);
  };

  const handleModalClosed = () => {
    setModalOpen(false);
  };

  return (
    <main className={`flex min-h-screen flex-col ${sora.className}`}>
      <Header
        handleClick={handleClick}
        title={zkStatus === Status.Processing ? "Processing..." : "Continue"}
        disabled={
          !schemaId ||
          zkStatus === Status.Processing ||
          msgStatus === Status.Processing
        }
      />
      <div
        className={`z-10 max-w-5xl w-full items-center mx-auto justify-between flex-col text-white pt-10`}
      >
        <h3 className="text-[32px] text-center w-full mb-5">
          Verida Dapp Connector
        </h3>
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
                  className={`p-3 rounded-md cursor-pointer flex gap-3 ${
                    schema.id == schemaId ? "bg-indigo-500" : ""
                  }`}
                  key={schema.id}
                  onClick={() => handleSchemaSelect(schema.id)}
                >
                  <input
                    type="radio"
                    checked={schema.id === schemaId}
                    readOnly
                  />
                  <div>
                    <h3 className="text-[14px] text-white">{schema.title}</h3>
                    <p className="text-[12px] text-white">
                      {schema.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {schemaId && (
        <VerificationModal
          isOpen={isModalOpen}
          onClose={handleModalClosed}
          handleBtnClick={handleClick}
          verifier={"zkPass"}
          schema={schemas.find((item) => item.id == schemaId)}
          zkStatus={zkStatus}
          msgStatus={msgStatus} 
        />
      )}

      <Footer />
    </main>
  );
}