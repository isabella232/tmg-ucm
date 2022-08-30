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

import type { Context, Env } from '../../types';
import { isJWTValid } from './jwt';

function authenticateKey(key: string, env: Env): boolean {
  return key === env.UI_KEY;
}

function authenticateBasic(encoded: string, env: Env): boolean {
  const decoded = atob(encoded);
  // user ignored for poc
  const [_, password] = decoded.split(':');
  return password === env.UI_PASSWORD;
}

/**
 * Check that the token is:
 * 1. not expired
 * 2. not revoked
 * 3. valid signature
 */
export async function authenticateToken(jwt: string, env: Env): Promise<boolean> {
  return isJWTValid(jwt, env);
}

async function authenticateCookie(cookieStr: string | undefined, env: Env): Promise<boolean> {
  if (!cookieStr) {
    return false;
  }

  const cookies = cookieStr.split(';').map((s) => s.trim());

  const cookieObj: Record<string, string> = {};
  cookies.forEach((c) => {
    const [key, ...vals] = c.split('=');
    cookieObj[key] = vals.join('=');
  });

  const { token } = cookieObj;
  if (!token) {
    return false;
  }

  return authenticateToken(token, env);
}

export async function isAuthenticated(request: Request, ctx: Context): Promise<boolean> {
  const { env } = ctx;

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const spl = authHeader.split(' ');
    const scheme = spl.shift();
    if (scheme) {
      const val = spl.join(' ');
      switch (scheme.toLowerCase()) {
        case 'basic':
          return authenticateBasic(val, env);
        case 'key':
          return authenticateKey(val, env);
        case 'bearer':
          return authenticateToken(val, env);
        default:
          break;
      }
    }
  }

  return authenticateCookie(request.headers.get('cookie'), env);
}
