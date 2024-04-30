"use client";
import { Sora } from "next/font/google";
import useAccount from "../hooks/useAccount";
import useVerify from "../hooks/useVerify";
import { useEffect } from "react";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const Verify = () => {
  const { connect, did, isConnected, isConnecting } = useAccount();
  const {
    requestVerification,
    registerSocket,
    isVerifying,
    verificationResult,
  } = useVerify();

  const handleRequestVC = async () => {
    await requestVerification(did);
  };

  useEffect(() => {
    if (!did) return;
    registerSocket(did);
  }, [did]);

  useEffect(() => {
    if (!isVerifying && verificationResult) {
      alert(verificationResult.result ? "Verified" : "Invalid credential");
    }
  }, [verificationResult, isVerifying]);

  return (
    <main className={`flex min-h-screen flex-col ${sora.className}`}>
      <div
        className={`z-10 max-w-5xl w-full items-center mx-auto justify-between flex-col text-white pt-10`}
      >
        {isConnecting && (
          <label htmlFor="" className="">
            Connecting...
          </label>
        )}
        {isConnected && (
          <>
            <h2>{did}</h2>
            <button className="" onClick={() => handleRequestVC()}>
              Request credential
            </button>
          </>
        )}
        {!isConnected && !isConnecting && (
          <button onClick={connect}>Connect</button>
        )}
      </div>
    </main>
  );
};

export default Verify;
