"use client";
import { Status, useZkPass } from "../hooks/useZkPass";
import { useCallback, useEffect, useState } from "react";
import { schemas } from "../config/providers";
import { useRouter } from "next/router";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";
import { Sora } from "next/font/google";
import { Header } from "../components/layouts/Header";
import { Footer } from "../components/layouts/Footer";
import VerificationModal from "../components/VerificationModal";
import { ProviderSelectionModal } from "../components/ProviderSelectionModal";
import { Schema } from "../@types";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const ZkPassView: React.FC<{}> = () => {
  const { verify, zkStatus, msgStatus } = useZkPass();
  const [zkAvailable, setZkAvailable] = useState<boolean>(false);

  const [isVerificationModalOpen, setVerificationModalOpen] =
    useState<boolean>(false);
  const [isProviderModalOpen, setProviderModalOpen] = useState<boolean>(true);

  const router = useRouter();
  const _schemaId = router.query.schemaId as string;
  const _veridaDid = router.query.veridaDid as string;

  const [schema, setSchema] = useState<Schema>();
  const [veridaDid, setVeridaDid] = useState<string>(_veridaDid || "");

  useEffect(() => {
    setSchema(schemas.find((item) => item.id == _schemaId));
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
    if ((!schema || !veridaDid) && (!_veridaDid || !_schemaId)) {
      alert("SchemaId or VeridaDid is missing");
      return;
    }

    if (!zkAvailable) {
      alert("You need to install TransGate extension");
      return;
    }

    if (verify) {
      verify(schema, veridaDid);
    }
  }, [verify, schema, veridaDid]);

  const handleSchemaSelect = (schema: Schema) => {
    setSchema(schema);
    setVerificationModalOpen(true);
  };

  const handleModalClosed = () => {
    setVerificationModalOpen(false);
  };

  return (
    <main className={`flex min-h-screen flex-col ${sora.className}`}>
      <div
        className={`z-10 max-w-5xl w-full items-center mx-auto justify-between flex-col text-white pt-10`}
      ></div>
      {schemas && (
        <ProviderSelectionModal
          handleItemClick={handleSchemaSelect}
          isOpen={isProviderModalOpen}
          onClose={() => setProviderModalOpen(false)}
          data={schemas}
        />
      )}
      {schema && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={handleModalClosed}
          handleBtnClick={handleClick}
          verifier={"zkPass"}
          schema={schema}
          zkStatus={zkStatus}
          msgStatus={msgStatus}
        />
      )}
    </main>
  );
};

export default ZkPassView;
