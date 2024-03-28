import { useRouter } from "next/router";
import providers from "../config/reclaim-providers";
import { useReclaim } from "../hooks/useReclaim";
import { useEffect, useState } from "react";

export default function ReclaimView() {
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
  };

  const { requestUrl, startVerification, statusTxt } = useReclaim(schemaId);

  return (
    <div>
      <p>{statusTxt}</p>
      <button onClick={handleClick} disabled={!requestUrl}>
        Start verification
      </button>

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
                <input type="radio" checked={schema.id === schemaId} readOnly />
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
  );
}
