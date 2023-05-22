declare namespace NodeJS {
  export interface ProcessEnv {
    API_BASE_URL: string;
    APP_VERSION: string;
    CRYPTO_SECRET: string;
    ENVIRONMENT: 'development' | 'production' | 'test';
    RPC_API_BASE_URL: string;
    SOLSCAN_API_TOKEN: string;
  }
}
