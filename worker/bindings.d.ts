declare global {
  // KV namespaces here

  export interface Process {
    env: {
      NODE_ENV: 'development' | 'production';
      API_KEY: string;
      UPSTREAM: string;
    }
  }

  export const process: Process;
}

export {};
