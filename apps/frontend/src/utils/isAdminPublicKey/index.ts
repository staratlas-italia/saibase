import { PublicKey } from "@solana/web3.js";
import { getAdminWallets } from "../getAdminWallets";

export const isAdminPublicKey = (publicKey: PublicKey) => {
  const admins = getAdminWallets();

  return admins.includes(publicKey?.toString());
};
