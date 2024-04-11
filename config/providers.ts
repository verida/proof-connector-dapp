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
    id: "9d2ea353-8819-447d-9e3f-c433a0d9fe40",
    title: "Uber user credentials",
    description: "Verify Uber user credentials",
    host: "Uber",
    icon: "uber.png",
    type: "KYC",
    src: "reclaim",
  },
];
