import { getApiRoute } from '@saibase/routes-api';
import { api } from "../api";
import { Player } from "../../types";
import { appendQueryParams } from "../../utils/appendQueryParams";

export const fetchPlayer = async (pubkey: string) => {
  try {
    const response = await api.get<Player>(
      appendQueryParams(getApiRoute('/api/player'), { pubkey })
    );

    return response;
  } catch (e) {
    return null;
  }
};
