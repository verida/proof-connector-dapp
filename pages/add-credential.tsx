"use client";
import { useZkPass } from "../hooks/useZkPass";
import { useCallback, useEffect, useState } from "react";
import { schemas } from "../config/providers";
import { useRouter } from "next/router";
import { Sora } from "next/font/google";
import VerificationModal from "../components/VerificationModal";
import { ProviderSelectionModal } from "../components/ProviderSelectionModal";
import { Schema } from "../@types";
import { useReclaim } from "../hooks/useReclaim";
import { checkZkTransgateAvailable } from "../utils";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const AddCredential: React.FC<{}> = () => {
  const [isVerificationModalOpen, setVerificationModalOpen] =
    useState<boolean>(false);

  const router = useRouter();
  const _schemaId = router.query.schemaId as string;
  const _veridaDid = router.query.veridaDid as string;
  const [isProviderModalOpen, setProviderModalOpen] = useState<boolean>(
    !_schemaId || !_veridaDid
  );

  const [schema, setSchema] = useState<Schema>(
    schemas.find((item) => item.id === _schemaId)
  );
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
      if (_schema.src == "zkPass") {
        handleClick(_schema, _veridaDid);
      }
      setProviderModalOpen(false);
      setVerificationModalOpen(true);
    }

    console.log("version: ", 2);
  }, [_schemaId, _veridaDid]);

  const handleClick = useCallback(
    async (schema: Schema, veridaDid: string) => {
      if (!schema || !veridaDid) {
        alert("SchemaId or VeridaDid is missing");
        return;
      }

      if (
        schema.src === "zkPass" &&
        !(await checkZkTransgateAvailable(schema))
      ) {
        console.log("TransGate extension is not installed");
        return;
      }

      if (schema.src === "zkPass") {
        if (verify) {
          verify(schema, veridaDid);
        }
      } else if (requestUrl) {
        window.open(requestUrl, "_blank");
        startVerification(veridaDid, schema);
      }
    },
    [verify, schema, veridaDid]
  );

  const handleSchemaSelect = (schema: Schema) => {
    setSchema(schema);
    setVerificationModalOpen(true);
    setProviderModalOpen(false);
  };

  const handleModalClosed = () => {
    setVerificationModalOpen(false);
    setProviderModalOpen(true);
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
          did={veridaDid}
          enabled={
            schema &&
            veridaDid &&
            (schema.src === "zkPass" ||
              (schema.src == "reclaim" && !!requestUrl))
          }
        />
      )}
    </main>
  );
};

export default AddCredential;
