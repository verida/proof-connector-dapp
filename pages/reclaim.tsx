"use client";
import { useRouter } from "next/router";
import { useReclaim } from "../hooks/useReclaim";
import { useEffect, useState } from "react";
import { Sora } from "next/font/google";
import { Header } from "../components/layouts/Header";
import { Status } from "../hooks/useZkPass";
import { Footer } from "../components/layouts/Footer";
import VerificationModal from "../components/VerificationModal";
import { schemas } from "../config/providers";
import { Schema } from "../@types";
const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const ReclaimView: React.FC<{}> = () => {
  const router = useRouter();
  const _schemaId = router.query.schemaId as string;
  const _veridaDid = router.query.veridaDid as string;

  const [schema, setSchema] = useState<Schema>();
  const [veridaDid, setVeridaDid] = useState<string>(_veridaDid || "");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setSchema(schemas.find((item) => item.id == _schemaId));
    setVeridaDid(_veridaDid);

    if (_schemaId) {
      handleClick();
    }
  }, [_schemaId, _veridaDid]);

  const handleClick = () => {
    if ((!schema || !veridaDid) && (!_veridaDid || !_schemaId)) {
      alert("SchemaId or VeridaDid is missing");
      return;
    }

    window.open(requestUrl, "_blank");
    startVerification(veridaDid, schema);
  };

  const handleSchemaSelect = (_schemaId) => {
    setSchema(_schemaId);
    setModalOpen(true);
  };

  const handleModalClosed = () => {
    setModalOpen(false);
  };
  const { requestUrl, startVerification, statusTxt, zkStatus, msgStatus } =
    useReclaim(schema);

  return (
    <main className={`flex min-h-screen flex-col ${sora.className}`}>
      <Header
        handleClick={handleClick}
        title={zkStatus === Status.Processing ? "Processing..." : "Continue"}
        disabled={
          !schema ||
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
        <p>{statusTxt}</p>
        {!_schemaId && (
          <div className="schemas">
            <ul className="">
              {schemas.map((_schema) => (
                <li
                  className={`mb-4 p-3 rounded-md cursor-pointer ${
                    _schema.id == schema?.id ? "bg-slate-500" : ""
                  }`}
                  key={_schema.id}
                  onClick={() => handleSchemaSelect(_schema.id)}
                  style={{ display: "flex", gap: "15px" }}
                >
                  <input
                    type="radio"
                    checked={_schema.id === schema?.id}
                    readOnly
                  />
                  <div>
                    <h3 className="text-[14px] text-white">{_schema.title}</h3>
                    <p className="text-[12px] text-white">
                      {_schema.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
      {schema && (
        <VerificationModal
          isOpen={isModalOpen}
          onClose={handleModalClosed}
          handleBtnClick={handleClick}
          schema={schema}
          zkStatus={zkStatus}
          msgStatus={msgStatus}
        />
      )}
    </main>
  );
};

export default ReclaimView;
