import { Keypair } from "@solana/web3.js";
import fs from "fs";

export const loadKeypair = (path: string): Keypair => {
  if (!path) {
    throw new Error("Keypair is required!");
  }

  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(path, "utf-8")))
  );

  console.log(`Loaded keypair: ${loaded.publicKey}`);

  return loaded;
};
