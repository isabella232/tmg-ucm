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

import type { Route } from '../../types';
import { responseHTML } from '../../util';
import { decodeJWTPayload, generateJWT, isJWTValid } from './jwt';

import indexHTML from './ui/index.html';

export { needsAuth } from './middleware';

const login: Route = async (request, ctx) => {
  const { env, log } = ctx;

  try {
    let json: Record<string, string>;
    try {
      json = await request.json();
    } catch (_) {
      return new Response('Invalid request', { status: 400 });
    }

    const { username, password } = json;
    log.info('username, password: ', username, password);

    if (!password || password.trim() !== env.UI_PASSWORD) {
      log.warn('Not authorized: ', password);
      return new Response('Not authorized', { status: 401 });
    }

    // random session ID as base64
    const [token, ttl] = await generateJWT(username, env);
    return new Response(JSON.stringify({ token }), {
      headers: {
        'set-cookie': `token=${token}; path=/; max-age=${ttl}`,
        'content-type': 'application/json',
      },
    });
  } catch (e) {
    log.error('[Auth] error: ', e);
    return new Response('Not authorized', { status: 401 });
  }
};

const logout: Route = async (request, ctx) => {
  let token: string;
  try {
    ({ token } = await request.json<{token: string}>());
  } catch (e) {
    return new Response('Invalid request', { status: 400 });
  }

  const valid = await isJWTValid(token, ctx.env);
  if (!valid) {
    return new Response('ok', { status: 200 });
  }

  const payload = decodeJWTPayload(token);
  await REVOKED_TOKENS.put(token, 'true', { expiration: payload.exp });
  return new Response('ok', { status: 200 });
};

export const AuthAPI: Route = async (request, ctx) => {
  ctx.log.log('[AuthAPI] pathname: ', ctx.url.pathname);

  switch (ctx.url.pathname) {
    case '/api/auth/login':
      return login(request, ctx);
    case '/api/auth/logout':
      return logout(request, ctx);
    default:
      return undefined;
  }
};

export const AuthUI: Route = (request, ctx) => {
  ctx.log.log('[AuthUI] pathname: ', ctx.url.pathname);
  switch (ctx.url.pathname) {
    case '/auth':
      return responseHTML(indexHTML);
    default:
      return undefined;
  }
};
