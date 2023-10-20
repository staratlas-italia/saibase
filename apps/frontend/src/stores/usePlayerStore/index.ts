import { mints } from '@saibase/constants';
import { getTokenBalanceByMint } from '@saibase/web3';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import { create } from 'zustand';
import { fetchPlayer } from "../../network/player";
import { fetchOrCreateSelf, linkDiscordId } from "../../network/self";
import { Avatar, Player } from "../../types";
import { Self } from "../../types/api";
import { getConnectionClusterUrl } from "../../utils/connection";
import { getAvatarImageUrl } from "../../utils/getAvatarImageUrl";
import { toTuple } from "../../utils/toTuple";

type PlayerStore = {
  self: Self | null;
  player: Player | null;
  isFetching: boolean;
  amounts: [number, number, number] | null;
  linkDiscord: (_: {
    publicKey: string;
    discordId: string;
    signature: string;
  }) => void;
  fetchSelf: (cluster: Cluster, publicKey: string) => void;
  clear: () => void;
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  self: null,
  player: null,
  isFetching: false,
  amounts: null,
  linkDiscord: async ({ discordId, publicKey, signature }) => {
    if (get().isFetching) {
      return;
    }

    set({ isFetching: true });

    const self = await linkDiscordId({
      discordId,
      publicKey,
      signature,
    });

    if (self) {
      set({
        self,
        isFetching: false,
      });
    }
  },
  fetchSelf: async (cluster, publicKey) => {
    if (get().isFetching) {
      return;
    }

    set({ isFetching: true });

    const connection = new Connection(getConnectionClusterUrl(cluster));

    const [currentPlayer, self, atlasAmount, polisAmount, usdcAmount] =
      await Promise.all([
        fetchPlayer(publicKey),
        fetchOrCreateSelf({ publicKey, cluster }),
        getTokenBalanceByMint(
          connection,
          new PublicKey(publicKey),
          mints.atlas
        )(),
        getTokenBalanceByMint(
          connection,
          new PublicKey(publicKey),
          mints.polis
        )(),
        getTokenBalanceByMint(
          connection,
          new PublicKey(publicKey),
          mints.usdc
        )(),
      ]);

    const amounts = toTuple([atlasAmount, polisAmount, usdcAmount]);

    if (currentPlayer) {
      const player = {
        ...currentPlayer,
        avatarImageUrl: getAvatarImageUrl(currentPlayer?.avatarId as Avatar),
      };

      set({
        amounts,
        player,
        self,
        isFetching: false,
      });

      return;
    }

    set({
      amounts,
      self,
      isFetching: false,
    });
  },
  clear: () => set({ self: null, player: null }),
}));
