declare namespace NodeJS {
  export interface ProcessEnv {
    APP_VERSION: string;
    ENVIRONMENT: 'development' | 'production' | 'test';
    RPC_API_BASE_URL: string;
    SOLSCAN_API_TOKEN: string;
  }
}
