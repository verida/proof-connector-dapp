import { Schema } from "../@types";

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
    icon: "uber.png",
    type: "KYC",
    src: "reclaim",
  },
];
