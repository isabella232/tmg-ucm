/// <reference types="@cloudflare/workers-types" />

declare global {
  // KV namespaces
  export const REVOKED_TOKENS: KVNamespace<string>;

  export interface Process {
    env: {
      NODE_ENV: 'development' | 'production';
      API_KEY: string;
      UPSTREAM: string;
      JWT_KEY: string;
      UI_KEY: string;
      UI_PASSWORD: string;
    }
  }

  export const process: Process;
}

export {};
