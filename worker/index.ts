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

import { v4 as uuidv4 } from 'uuid';
import handleRequest from './handler';
import type { Env } from './types';

export default {
  async fetch(request: Request, env: Env) {
    const requestId = uuidv4();
    const ctx = {
      log: console,
      env,
      invocation: {
        requestId,
      },
    };

    let resp = await handleRequest(request, ctx);
    resp = new Response(
      resp.body,
      resp,
    );
    resp.headers.set('x-request-id', requestId);
    return resp;
  },
};
