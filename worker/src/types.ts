/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/// <reference types="@cloudflare/workers-types" />

// import { RouteHandler } from 'itty-router';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyOk = any;

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'DELETE';

export interface Invocation {
  requestId: string;
}

export interface Env {
  UPSTREAM: string;
  API_ENDPOINT: string;
  CONTENT_ENDPOINT: string;
  API_KEY: string;
  CACHE_GEN: string;
  UI_PASSWORD: string;
  UI_KEY: string;
  JWT_KEY: string;

  // KV namespaces
  REVOKED_SESSIONS: KVNamespace<string>;
}

export interface Context {
  log: typeof console;
  env: Env;
  invocation: Invocation;
  url: URL;
  rewriter: HTMLRewriter;
}

export type Route = (
  req: Request,
  ctx: Context
) => Promise<Response | undefined> | Response | undefined;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T = {}> = new (...args: any[]) => T;

type Join<K, P> = K extends string | number ?
  P extends string | number ?
  `${K}${'' extends P ? '' : '.'}${P}`
  : never : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

/**
 * Get leaves of object as period delimited string.
 * @example
 * ```ts
 * const obj = { foo: 0, bar: { baz: { other: 1 }}} as const;
 * type Keys = DeepObjectKeys<typeof obj>;
 * // Keys = 'foo' | 'bar.baz.other'
 * ```
 */
export type DeepObjectKeys<
  T,
  D extends number = 10
> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: Join<K, DeepObjectKeys<T[K], Prev[D]>> }[keyof T] : '';
