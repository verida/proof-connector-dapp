import { Schema } from "../@types";

export const CredentialSchema = {
  zkPass:
    "https://common.schemas.verida.io/credential/zkpass/v0.1.0/schema.json",
  reclaim:
    "https://common.schemas.verida.io/credential/reclaim/v0.1.0/schema.json",
  baseCredential:
    "https://common.schemas.verida.io/credential/base/v0.2.0/schema.json",
};

export const schemas: Schema[] = [
  {
    id: "ef39adb26c88439591279e25e7856b61",
    title: "Verify ownership of your Uber account",
    host: "Uber",
    icon: "uber.png",
    type: "KYC",
    description: "Verify ownership of your Uber account",
    message: "Uber account ownership",
    src: "zkPass",
  },
  {
    id: "c0519cf1b26c403096a6af51f41e3f8d",
    title: "Verify ownership of your Discord account",
    host: "Discord",
    icon: "discord.png",
    type: "Social",
    description: "Verify ownership of your Discord account",
    message: "Discord account ownership",
    src: "zkPass",
  },
  {
    id: "f3a4394b-191a-4889-9f5c-e0d70dc26fac",
    title: "Verify ownership of your Uber account",
    description: "Verify ownership of your Uber account",
    host: "Uber",
    icon: "uber.png",
    type: "KYC",
    message: "Uber account ownership",
    src: "reclaim",
  },
  {
    id: "c94476a0-8a75-4563-b70a-bf6124d7c59b",
    title: "Verify ownership of your Kaggle account",
    description: "Verify ownership of your Kaggle account",
    host: "Kaggle",
    icon: "kaggle.png",
    type: "KYC",
    message: "Kaggle account ownership",
    src: "reclaim",
  },
  {
    id: "bc44047a987e4872b08e96223ed5775a",
    title: "Verify KYC level of your Binance account",
    description: "Verify KYC level of your Binance account",
    message: "Binance account KYC verification",
    host: "Binance",
    icon: "binance.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "5f83218da6e544e7ac41566d0840e842",
    title: "Verify KYC level of your Bybit account",
    description: "Verify KYC level of your Bybit account",
    message: "Bybit account KYC verification",
    host: "Bybit",
    icon: "bybit.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "01c1439e852f47aaa4f697cef14d3e94",
    title: "Verify KYC level of your KuCoin account",
    description: "Verify KYC level of your KuCoin account",
    message: "Kucoin account KYC verification",
    host: "KuCoin",
    icon: "kucoin.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "a0b39e397cc54083a1bb1ba3ea3338f9",
    title: "Verify KYC level of your MEXC account",
    description: "Verify KYC level of your MEXC account",
    message: "MEXC account KYC verification",
    host: "MEXC",
    icon: "mexc.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "8dd0e65d44c74ff8a405bc5a35e68387",
    title: "Verify KYC level of your Gate account",
    description: "Verify KYC level of your Gate account",
    message: "Gate account KYC verification",
    host: "Gate",
    icon: "gate.png",
    type: "KYC",
    src: "zkPass",
  },

  {
    id: "67bd34153e9e45bcabe75300c72ecf06",
    title: "Verify ownership of your Binance account",
    description: "Verify ownership of your Binance account",
    message: "Binance account ownership",
    host: "Binance",
    icon: "binance.png",
    type: "Ownership",
    src: "zkPass",
  },
  {
    id: "96c3dcf5807342069e9bf4b02e6fc2fe",
    title: "Verify ownership of your Bybit account",
    description: "Verify ownership of your Bybit account",
    message: "Bybit account ownership",
    host: "Bybit",
    icon: "bybit.png",
    type: "Ownership",
    src: "zkPass",
  },
  {
    id: "640719c1bdf44aabaca519f12e184d54",
    title: "Verify ownership of your MEXC account",
    description: "Verify ownership of your MEXC account",
    message: "MEXC account ownership",
    host: "MEXC",
    icon: "mexc.png",
    type: "Ownership",
    src: "zkPass",
  },
  {
    id: "20663ead45694b8682ece3ed4b4e00d4",
    title: "Verify ownership of your Gate account",
    description: "Verify ownership of your Gate account",
    message: "Gate account ownership",
    host: "Gate",
    icon: "gate.png",
    type: "Ownership",
    src: "zkPass",
  },
  {
    id: "df666f142a264ea99db95bb64012f514",
    title: "Verify ownership of your KuCoin account",
    description: "Verify ownership of your KuCoin account",
    message: "Kucoin account ownership",
    host: "KuCoin",
    icon: "kucoin.png",
    type: "Ownership",
    src: "zkPass",
  },
];
