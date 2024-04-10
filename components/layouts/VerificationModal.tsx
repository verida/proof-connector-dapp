"use client";

import cx from "classnames";
import { ModalButton } from "../ModalButton";
import { Icon } from "@iconify/react";
import { Sora } from "next/font/google";
import { Status } from "../../hooks/useZkPass";
import { useEffect, useState } from "react";

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  isOpen: boolean,
  onClose: React.Dispatch<void>,
  handleBtnClick: React.Dispatch<void>,
  verifier: string,
  schema: any,
  zkStatus: number,
  msgStatus: number
}
const VerificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  handleBtnClick,
  verifier,
  schema,
  zkStatus,
  msgStatus,
}) => {
  const [btnTxt, setBtnTxt] = useState("");
  useEffect(() => {
    if (zkStatus == Status.None || msgStatus == Status.None) {
      setBtnTxt("Start Verification");
    } else if (zkStatus == Status.Success && msgStatus == Status.Success) {
      setBtnTxt("Check Inbox");
    } else if (zkStatus == Status.Failed || msgStatus == Status.Failed) {
      setBtnTxt("Try again");
    } else {
      setBtnTxt("Start Verification");
    }
  }, [zkStatus, msgStatus]);
  return (
    <div
      className={cx(
        "fixed inset-0 z-[1300] flex items-center justify-center bg-white/10 p-4 transition-all duration-200 ease-in-out",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-8 opacity-0",
        sora.className
      )}
    >
      <div className="absolute inset-0" onClick={() => onClose()} />
      <div className="relative z-10 w-full max-w-md space-y-4 rounded-xl bg-white p-4">
        <div className="modal-header flex justify-between w-full">
          <Icon icon={"ep:back"} className="text-[24px] cursor-pointer" onClick={() => onClose()}/>
          <Icon icon={"iconoir:xmark"} className="text-[24px] cursor-pointer" onClick={() => onClose()}/>
        </div>
        <div className="modal-body text-center">
          <div className="logo-wrapper flex justify-center">
            <img
              src={`/imgs/${
                verifier === "zkPass" ? "zkPass.png" : "reclaim.png"
              }`}
              alt={schema.host}
              className="p-[2px] rounded-full bg-white w-14 h-14"
            />
            <img
              src={`/imgs/${schema.icon}`}
              alt={schema.host}
              className="z-10 ml-[-20px] p-[2px] rounded-full bg-white w-14 h-14"
            />
          </div>
          <h3 className={`text-center text-black mt-4 font-bold`}>
            {schema.host}
          </h3>
          <p className="text-center mt-1 text-[#6B7280]">
            {schema.description}
          </p>
          <div className="description text-[#6B7280] flex justify-between mt-7 text-[12px]">
            <span className="">Type of credentials:</span>
            <span className="text-black">{schema.type}</span>
          </div>
          <div className="description text-[#6B7280] flex justify-between mt-2 text-[12px]">
            <span className="">Type of proof:</span>
            <div className="flex items-center">
              <img
                src={`/imgs/${
                  verifier === "zkPass" ? "zkPass.png" : "reclaim.png"
                }`}
                alt={schema.host}
                className="p-[2px] rounded-full bg-white w-[24px] h-[24px]"
              />
              <span className="">{verifier}</span>
            </div>
          </div>
        </div>
        {zkStatus == Status.Success && msgStatus == Status.Success && (
          <>
            <Icon
              icon={"icon-park-solid:check-one"}
              className="text-[64px] cursor-pointer text-[#5ECEA5] mx-auto"
            />
            <p className="text-[#6B7280] text-center w-full text-[14px ]">
              Verification is now complete. Please check your Verida Wallet
              Inbox.
            </p>
          </>
        )}
        {(zkStatus == Status.Failed || msgStatus == Status.Failed) && (
          <>
            <p className="text-[red] text-center w-full text-[14px ]">
              Something went wrong.
            </p>
          </>
        )}
        <div className="space-y-10 modal-footer">
          {zkStatus == Status.Processing || msgStatus == Status.Processing ? (
            <>
              <Icon
                icon={"eos-icons:loading"}
                className="text-[56px] cursor-pointer text-[#5ECEA5] mx-auto"
              />
              {zkStatus == Status.Processing && (
                <p className="text-[#6B7280] text-center w-full text-[14px ]">
                  Please complete verification and return to this page
                </p>
              )}
              {msgStatus == Status.Processing && (
                <p className="text-[#6B7280] text-center w-full text-[14px ]">
                  Sending proof to verida wallet
                </p>
              )}
            </>
          ) : (
            <ModalButton onClick={handleBtnClick} title={btnTxt} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
