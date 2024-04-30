import { EnvironmentType } from "@verida/types";
import { WebUser } from "@verida/web-helpers";
import { useCallback, useRef, useState } from "react";

const webUserInstance = new WebUser({
  debug: true,
  clientConfig: {
    environment: EnvironmentType.MAINNET,
    didClientConfig: {
      network: EnvironmentType.MAINNET,
    },
  },
  contextConfig: {
    name: "Verida: Vault",
  },
  accountConfig: {
    request: {
      logoUrl: "", // TODO
    },
    environment: EnvironmentType.MAINNET,
  },
});
export default function useAccount() {
  const webUserInstanceRef = useRef<WebUser>(webUserInstance);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setConnected] = useState<boolean>(false);
  const [did, setDid] = useState<string>();
  const [account, setAccount] = useState<WebUser>();

  const connect = useCallback(async () => {
    if (!webUserInstanceRef) return;
    setIsConnecting(true);
    try {
      const connected = await webUserInstanceRef.current.connect();
      setConnected(connected);
      setDid(webUserInstanceRef.current?.getDid());
      setAccount(webUserInstanceRef.current);
    } catch (err) {
      console.error("Error while connecting verida wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [webUserInstanceRef]);

  const disconnect = useCallback(async () => {
    try {
      if (!webUserInstanceRef) return;
      await webUserInstanceRef.current?.disconnect();
      setConnected(false);
      setDid(undefined);
      setAccount(undefined);
    } catch (err) {
      console.error("Error while disconnect");
    }
  }, [webUserInstanceRef]);

  return { isConnected, isConnecting, did, account, connect, disconnect };
}
