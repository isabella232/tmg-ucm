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

import type { Context, Route } from '../../types';
import { isAuthenticated } from './validate';

export function unauthenticatedResponse(ctx: Context) {
  const path = ctx.url.pathname;
  const hasPath = path.length > 1;
  return new Response('', {
    status: 302,
    headers: {
      location: `/auth${hasPath ? `#${encodeURIComponent(path)}` : ''}`,
      'set-cookie': 'token=;max-age=-1;',
    },
  });
}

export const needsAuth: Route = async (request, ctx) => {
  const ok = await isAuthenticated(request, ctx);
  if (!ok) {
    return unauthenticatedResponse(ctx);
  }

  return undefined;
};
