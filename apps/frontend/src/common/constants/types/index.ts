import { PublicKey } from '@solana/web3.js';
import { TranslationId } from "../../../i18n/translations/types";

export type SwapSetting = {
  size?: string;
  discounted?: boolean;
  mint: PublicKey;
  name: string;
  quantity?: number;
  swapAccount: PublicKey;
  prices?: {
    real: number;
    full: number;
  };
  vaultCurrency: string;
  image: {
    normal: string;
    square: string;
  };
  discounts?: {
    discountRelativeToPreviousBundle: number;
    preReleaseDiscount: number;
  };
  sections: {
    intro: {
      title: TranslationId;
      description: TranslationId;
    };
    checkout: {
      title: TranslationId;
      subtitle: TranslationId;
    };
    confirmed: {
      description: TranslationId;
    };
  };
};
