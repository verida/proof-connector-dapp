"use client";
import { Sora } from "next/font/google";
import useAccount from "../hooks/useAccount";
import useVerify from "../hooks/useVerify";
import { useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const Verify = () => {
  const { connect, did, isConnected, isConnecting, disconnect } = useAccount();
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

  const handleConnectButtonClicked = useCallback(() => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }, [connect, disconnect, isConnected]);

  console.log("isVerifying: ", isVerifying);

  return (
    <main className={`flex min-h-screen flex-col ${sora.className}`}>
      <div
        className={`z-10 max-w-5xl w-full items-center mx-auto justify-between flex flex-col text-white pt-10 gap-5`}
      >
        <button
          onClick={handleConnectButtonClicked}
          className="bg-[#5354D1] hover:bg-[#6b6bd8] text-white text-[16px] rounded-md px-5 py-3 flex justify-center items-center disabled:cursor-not-allowed"
          disabled={isConnecting}
        >
          {isConnected && did}
          {!isConnected && !isConnecting && "Connect"}
          {!isConnected && isConnecting && (
            <Icon
              icon={"eos-icons:loading"}
              className="text-[32px] cursor-pointer text-[#5ECEA5] mx-auto"
            />
          )}
        </button>
        {isConnected && (
          <>
            <button
              className="bg-[#5354D1] hover:bg-[#6b6bd8] text-white text-[16px] rounded-md px-5 py-3 flex justify-center items-center disabled:cursor-not-allowed"
              onClick={() => handleRequestVC()}
              disabled={isVerifying}
            >
              {!isVerifying && "Request credential"}
              {isVerifying && (
                <Icon
                  icon={"eos-icons:loading"}
                  className="text-[32px] cursor-pointer text-[#5ECEA5] mx-auto"
                />
              )}
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Verify;
