"use client";
import { Status, useZkPass } from "../hooks/useZkPass";
import { useCallback, useEffect, useState } from "react";
import { schemas } from "../config/providers";
import { useRouter } from "next/router";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";
import { Sora } from "next/font/google";
import VerificationModal from "../components/VerificationModal";
import { ProviderSelectionModal } from "../components/ProviderSelectionModal";
import { Schema } from "../@types";
import { useReclaim } from "../hooks/useReclaim";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const AddCredential: React.FC<{}> = () => {
  const [isVerificationModalOpen, setVerificationModalOpen] =
    useState<boolean>(false);
  const [isProviderModalOpen, setProviderModalOpen] = useState<boolean>(true);

  const router = useRouter();
  const _schemaId = router.query.schemaId as string;
  const _veridaDid = router.query.veridaDid as string;

  const [schema, setSchema] = useState<Schema>();
  const [veridaDid, setVeridaDid] = useState<string>(_veridaDid || "");

  const { verify, zkStatus, msgStatus } = useZkPass();
  const {
    requestUrl,
    startVerification,
    statusTxt,
    zkStatus: reclaimZkStatus,
    msgStatus: reclaimMsgStatus,
  } = useReclaim(schema);

  useEffect(() => {
    const _schema = schemas.find((item) => item.id == _schemaId);
    setSchema(_schema);
    setVeridaDid(_veridaDid);

    if (_schemaId && _veridaDid) {
      handleClick(_schema, _veridaDid);
      setVerificationModalOpen(true);
    }
  }, [_schemaId, _veridaDid]);

  const checkZkAvailable = async (schema: Schema) => {
    if (!schema) return;
    if (schema.src === "zkPass") {
      const connector = new TransgateConnect(ZKPASS_APP_ID);
      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable();
      return isAvailable;
    } else {
      return requestUrl ? true : false;
    }
  };

  const handleClick = useCallback(
    (schema: Schema, veridaDid: string) => {
      if (!schema || !veridaDid) {
        alert("SchemaId or VeridaDid is missing");
        return;
      }

      if (!checkZkAvailable(schema)) {
        if (schema.src === "zkPass") {
          alert("You need to install TransGate extension");
          return;
        } else {
          if (!requestUrl) return;
        }
      }

      if (schema.src === "zkPass") {
        if (verify) {
          verify(schema, veridaDid);
        }
      } else {
        window.open(requestUrl, "_blank");
        startVerification(veridaDid, schema);
      }
    },
    [verify, schema, veridaDid]
  );

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
          handleBtnClick={() => handleClick(schema, veridaDid)}
          schema={schema}
          zkStatus={schema.src === "zkPass" ? zkStatus : reclaimZkStatus}
          msgStatus={schema.src === "zkPass" ? msgStatus : reclaimMsgStatus}
        />
      )}
    </main>
  );
};

export default AddCredential;
