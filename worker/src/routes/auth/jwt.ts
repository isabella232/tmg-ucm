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

import { Context, Env } from '../../types';
import { bufToHex, hexToBuf } from '../../util';

const VALID_DURATION = 1209600; // 14 days in seconds
const ALG = 'HS256';
const TYP = 'JWT';

export interface JWTPayload {
  /** subject */
  sub: string;
  /** issued at */
  iat: number;
  /** expires at */
  exp: number;
  admin?: boolean;
}

interface JWTHeader {
  alg: string;
  typ: 'JWT';
}

export async function getCryptoKey(env: Env, usages: string[] = ['sign']): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.JWT_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usages,
  );
  return key;
}

export function decodeJWTPayload(jwt: string): JWTPayload {
  const [_, ePayload] = jwt.split('.');
  const payload = atob(ePayload);
  return JSON.parse(payload) as JWTPayload;
}

export async function isJWTValid(jwt: string, ctx: Context): Promise<boolean> {
  const { env, log } = ctx;
  const [eHeader, ePayload, hSig] = jwt.split('.');
  if (!eHeader || !ePayload || !hSig) {
    return false;
  }

  const revoked = await env.REVOKED_SESSIONS.get(jwt);
  if (revoked) {
    return false;
  }

  const header = JSON.parse(atob(eHeader)) as JWTHeader;
  const payload = JSON.parse(atob(ePayload)) as JWTPayload;
  if (header.alg !== ALG || header.typ !== TYP) {
    return false;
  }

  if (Date.now() / 1000 > payload.exp) {
    log.info('[Auth/jwt] payload expired: ', payload.exp, Date.now() / 1000);

    return false;
  }

  const key = await getCryptoKey(env, ['verify']);
  const sig = hexToBuf(hSig);

  const encoder = new TextEncoder();
  const valid = await crypto.subtle.verify('HMAC', key, sig, encoder.encode(`${eHeader}.${ePayload}`));
  return valid;
}

export async function generateJWT(
  username: string,
  env: Env,
): Promise<[token: string, ttl: number]> {
  const now = Date.now() / 1000;

  const header: JWTHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const eHeader = btoa(JSON.stringify(header));

  const payload: JWTPayload = {
    sub: username,
    iat: now,
    exp: now + VALID_DURATION,
    admin: username === 'admin',
  };
  const ePayload = btoa(JSON.stringify(payload));

  const key = await getCryptoKey(env);
  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${eHeader}.${ePayload}`));
  const eSig = bufToHex(sig);

  return [`${eHeader}.${ePayload}.${eSig}`, VALID_DURATION];
}
