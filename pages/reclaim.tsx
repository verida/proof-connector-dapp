"use client";
import { useRouter } from "next/router";
import providers from "../config/reclaim-providers";
import { useReclaim } from "../hooks/useReclaim";
import { useEffect, useState } from "react";
import { Sora } from "next/font/google";
import { Header } from "../components/layouts/Header";
import { Status } from "../hooks/useZkPass";
import { Footer } from "../components/layouts/Footer";
import VerificationModal from "../components/layouts/VerificationModal";
const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const ReclaimView: React.FC<{}> = () => {
  const router = useRouter();
  const _schemaId = router.query.schemaId as string;
  const _veridaDid = router.query.veridaDid as string;

  const [schemaId, setSchemaId] = useState<string>(_schemaId || "");
  const [veridaDid, setVeridaDid] = useState<string>(_veridaDid || "");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setSchemaId(_schemaId);
    setVeridaDid(_veridaDid);

    if (_schemaId) {
      handleClick();
    }
  }, [_schemaId, _veridaDid]);

  const handleClick = () => {
    if ((!schemaId || !veridaDid) && (!_veridaDid || !_schemaId)) {
      alert("SchemaId or VeridaDid is missing");
      return;
    }

    window.open(requestUrl, "_blank");
    startVerification(veridaDid);
  };

  const handleSchemaSelect = (_schemaId) => {
    setSchemaId(_schemaId);
    setModalOpen(true);
  };

  const handleModalClosed = () => {
    setModalOpen(false);
  };
  const { requestUrl, startVerification, statusTxt, zkStatus, msgStatus } =
    useReclaim(schemaId);

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
        <p>{statusTxt}</p>
        {!_schemaId && (
          <div className="schemas">
            <ul className="">
              {providers.map((schema) => (
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
      <Footer />
      {schemaId && (
        <VerificationModal
          isOpen={isModalOpen}
          onClose={handleModalClosed}
          handleBtnClick={handleClick}
          verifier={"Reclaim"}
          schema={providers.find((item) => item.id == schemaId)}
          zkStatus={zkStatus}
          msgStatus={msgStatus}
        />
      )}
    </main>
  );
};

export default ReclaimView;
