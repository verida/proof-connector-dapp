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
    title: "Verify Uber account",
    host: "Uber",
    icon: "uber.png",
    type: "KYC",
    description: "Verify if you own uber account",
    src: "zkPass",
  },
  {
    id: "c0519cf1b26c403096a6af51f41e3f8d",
    title: "Verify Discord account",
    host: "Discord",
    icon: "discord.png",
    type: "Social",
    description: "Verify if you own discord account",
    src: "zkPass",
  },
  {
    id: "f3a4394b-191a-4889-9f5c-e0d70dc26fac",
    title: "Uber user credentials",
    description: "Verify Uber user credentials",
    host: "Uber",
    icon: "uber.png",
    type: "KYC",
    src: "reclaim",
  },
  {
    id: "c94476a0-8a75-4563-b70a-bf6124d7c59b",
    title: "Kaggle user name",
    description: "Verify you own kaggle user name",
    host: "Kaggle",
    icon: "kaggle.png",
    type: "KYC",
    src: "reclaim",
  },
  {
    id: "556ed720e40c4fb48ea7545708e47c90",
    title: "Verify Binance account",
    description: "Verify you own binance account",
    host: "Binance",
    icon: "binance.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "afc3447c5b0f48588db5640472691d37",
    title: "Verify Bybit account",
    description: "Verify you own bybit account",
    host: "Bybit",
    icon: "bybit.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "01c1439e852f47aaa4f697cef14d3e94",
    title: "Verify KuCoin KYC",
    description: "Verify you passed KuCoin KYC",
    host: "KuCoin",
    icon: "kucoin.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "d73e2c2227f642dcbade873ff2b09173",
    title: "Verify MEXC account",
    description: "Verify you own MEXC account",
    host: "MEXC",
    icon: "mexc.png",
    type: "KYC",
    src: "zkPass",
  },
  {
    id: "a3b6bf7a231e45a582ffd0e50245c849",
    title: "Verify Gate account",
    description: "Verify you own Gate account",
    host: "Gate",
    icon: "gate.png",
    type: "KYC",
    src: "zkPass",
  },
];
