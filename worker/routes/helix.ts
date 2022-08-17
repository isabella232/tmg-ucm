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

const Helix: Route = async (request, ctx) => {
  const { env, log } = ctx;

  const url = new URL(request.url);
  const upstream = `${env.UPSTREAM}${url.pathname}${url.search}`;

  log.debug('[Helix] fetching: ', upstream);

  const req = new Request(upstream, request);
  if (req.headers.has('host')) {
    req.headers.set('x-forwarded-host', req.headers.get('host'));
  }

  let resp = await fetch(req);
  resp = new Response(resp.body, resp);
  resp.headers.set('access-control-allow-origin', '*');
  resp.headers.delete('age');
  resp.headers.delete('x-robots-tag');
  return resp;
};

export default Helix;
