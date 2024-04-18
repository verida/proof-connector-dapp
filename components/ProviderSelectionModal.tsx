"use client";

import cx from "classnames";
import { Icon } from "@iconify/react";
import { Sora } from "next/font/google";
import { Schema } from "../@types";
import { data } from "autoprefixer";
import Image from "next/image";
import { useEffect, useState } from "react";
const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  isOpen: boolean;
  onClose: React.Dispatch<void>;
  handleItemClick: React.Dispatch<Schema>;
  data: Schema[];
}

export const ProviderSelectionModal = ({
  isOpen,
  onClose,
  handleItemClick,
  data,
}: Props) => {
  const [searchText, setSearchText] = useState<string>();
  const [providers, setProviders] = useState<Schema[]>([]);

  useEffect(() => {
    if (!searchText) {
      setProviders(data);
    } else {
      setProviders(
        data.filter((item) =>
          item.host.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, data]);

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
          <h3 className="text-[20px]">Add Credential</h3>
          <Icon
            icon={"iconoir:xmark"}
            className="text-[24px] cursor-pointer"
            onClick={() => onClose()}
          />
        </div>
        <div className="modal-body text-center">
          <div className="relative w-full mb-2 rounded-md border-[1px] overflow-hidden">
            <Icon
              icon={"material-symbols-light:search"}
              className="text-[24px] cursor-pointer absolute left-2 top-2"
            />
            <input
              type="text"
              placeholder="Search"
              className="p-2 w-full pl-9 outline-none border-none shadow-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <ul className="">
            {providers.map((schema, id) => {
              return (
                <li
                  className="mb-2 cursor-pointer hover:bg-slate-200"
                  onClick={() => handleItemClick(schema)}
                  key={id}
                >
                  <div className="flex gap-2 border-[1px] rounded-md px-3 py-2">
                    <div className="relative">
                      <Image
                        src={`/imgs/${schema.icon}`}
                        width={48}
                        height={48}
                        alt={schema.title}
                        className="rounded-full w-[48px] h-[48px]"
                      />
                      <Image
                        src={`/imgs/${schema.src}.png`}
                        alt={schema.src}
                        width={20}
                        height={20}
                        className="rounded-full w-[20px] h-[20px] absolute right-0 bottom-0"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-black font-semibold">
                        {schema.host}
                      </span>
                      <span className="text-[#777777]">
                        {schema.description}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
