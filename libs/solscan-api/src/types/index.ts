export type Block = {
  currentSlot: number;
  result: {
    blockhash: string;
    blockHeight: number;
    blockTime: number;
    fee_rewards: number;
    parentSlot: number;
    previousBlockhash: string;
    transactions_count: number;
    validator: string;
  };
};

type ParsedInstruction = {
  programId: string;
  type: string;
  data: string;
  dataEncode: string;
  name: string;
  params: {
    Account0: string;
    Account1: string;
    Account2: string;
    Account3: string;
    Account4: string;
    Account5: string;
    Account6: string;
  };
};

export type Transaction = {
  blockTime: number;
  slot: number;
  txHash: string;
  fee: number;
  status: string;
  lamport: number;
  signer: string[];
  logMessage: string[];
  inputAccount: {
    account: string;
    signer: boolean;
    writable: boolean;
    preBalance: number;
    postBalance: number;
  }[];
  recentBlockhash: string;
  innerInstructions: {
    index: number;
    parsedInstructions: ParsedInstruction[];
  }[];
  tokenBalanes: Transaction[];
  parsedInstruction: ParsedInstruction[];
  confirmations: number;
  tokenTransfers: Transaction[];
  solTransfers: Transaction[];
  serumTransactions: Transaction[];
  raydiumTransactions: Transaction[];
  unknownTransfers: {
    programId: string;
    event: {
      source: string;
      destination: string;
      amount: number;
      type: string;
      decimals: number;
      symbol: string;
      tokenAddress: string;
    }[];
  }[];
};

export type TokenHolderStatistic = {
  _id: string;
  datetime: number;
  interval: string;
  tokenAddress: string;
  type: string;
  lastUpdatedTime: number;
  total: number;
};

export type TokenHolderItem = {
  address: string;
  amount: number;
  decimals: number;
  owner: string;
  rank: number;
};

export type TokenHolderData = {
  address: string;
  amount: number;
  decimals: number;
  owner: string;
  rank: number;
};

export type TokenHolderList = {
  data: TokenHolderData[];
  total: number;
};

export type TokenMetaDataItem = {
  symbol: string;
  name: string;
  icon: string;
  website: string;
  twitter: string;
  tag: unknown[];
  decimals: number;
  coingeckoId: string;
  holder: number;
};

export type TrendingTokenItem = {
  token: string;
  tokenData: {
    symbol: string;
    name: string;
    icon: string;
    website: string;
    twitter: string;
    tag: { name: string; description: string }[];
    decimals: number;
    coingeckoId: string;
    holder: number;
  };
  totalCalled: number;
};

export type TokenWithMarketInformation = {
  mintAddress: string;
  tokenSymbol: string;
  tokenName: string;
  decimals: number;
  icon: string;
  website: string;
  twitter: string;
  extensions: {
    website: string;
    coingeckoId: string;
  };
  tokenHolder: boolean;
  marketCapRank: number;
  supply: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
  holder: number;
  priceUst: number;
  marketCapFD: number;
  volume: {
    volumeUsd: number;
    volume: number;
  };
  coingeckoInfo: {
    marketCapRank: number;
    coingeckoRank: number;
    marketData: {
      currentPrice: number;
      ath: number;
      athChangePercentage: number;
      athDate: string;
      atl: number;
      atlChangePercentage: number;
      atlDate: string;
      marketCap: number;
      marketCapRank: number;
      fullyDilutedValuation: number;
      totalVolume: number;
      priceHigh24h: number;
      priceLow24h: number;
      priceChange24h: number;
      priceChangePercentage24h: number;
      priceChangePercentage7d: number;
      priceChangePercentage14d: number;
      priceChangePercentage30d: number;
      priceChangePercentage60d: number;
      priceChangePercentage200d: number;
      priceChangePercentage1y: number;
      marketCapChange24h: number;
      marketCapChangePercentage24h: number;
      totalSupply: number;
      maxSupply: number;
      circulatingSupply: number;
      lastUpdated: string;
    };
  };
  tag: unknown[];
};

export type AccountInfo = {
  lamports: number;
  ownerProgram: string;
  type: string;
  rentEpoch: number;
  account: string;
};
