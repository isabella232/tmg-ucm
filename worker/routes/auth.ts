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

import type { Route } from '../types';

const Auth: Route = async (request, ctx) => {
  const { env, log } = ctx;
  const json: Record<string, string> = await request.json();
  const { token } = json;
  if (!token || token.trim() !== env.API_KEY) {
    log.warn('Not authorized: ', token);
    return new Response('Not authorized', { status: 401 });
  }
  return new Response('Ok', { headers: { 'set-cookie': `auth_token=${token}` } });
};

export default Auth;
