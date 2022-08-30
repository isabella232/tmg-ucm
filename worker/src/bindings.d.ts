declare global {
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
