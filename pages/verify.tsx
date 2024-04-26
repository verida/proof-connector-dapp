"use client";
// import { VaultAccount, hasSession } from '@verida/account-web-vault'
import { EnvironmentType } from '@verida/types';
import { WebUser } from "@verida/web-helpers";
import { Sora } from "next/font/google";
import { useCallback, useRef, useState } from 'react';

const sora = Sora({ subsets: ["latin"], weight: ["400", "500"] });

const webUserInstance = new WebUser({
  debug: true,
  clientConfig: {
    environment: EnvironmentType.MAINNET,
    didClientConfig: {
      network: EnvironmentType.MAINNET,
    },
  },
  contextConfig: {
    name: 'Verida: Vault',
  },
  accountConfig: {
    request: {
      logoUrl: '', // TODO
    },
    environment: EnvironmentType.MAINNET,
  },
});

const Verify: React.FC<{}> = () => {
  const webUserInstanceRef = useRef(webUserInstance);
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = useCallback(async () => {
    setIsConnecting(true);
    const connected = await webUserInstanceRef.current.connect();
    setIsConnecting(false);

    return connected;
  }, [webUserInstanceRef]);


  return (
    <main className={`flex min-h-screen flex-col ${sora.className}`}>
      <div
        className={`z-10 max-w-5xl w-full items-center mx-auto justify-between flex-col text-white pt-10`}
      >
        {isConnecting ? <h2>Connecting</h2> : <button onClick={connect}>Connect</button>}
      </div>

    </main>
  );
};

export default Verify;
