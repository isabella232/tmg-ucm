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

import { Constructor, DeepObjectKeys } from '../types';

export const sectionMetadata = (meta: Record<string, string>) => {
  return `\
  <div class="section-metadata">
${
  Object.entries(meta).map(([k, v]) => {
    return `\
    <div>
      <div>${k}</div>
      <div>${v}</div>
    </div>`;
  }).join('\n')
}
  </div>`;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export interface AsyncKeySetter<T = {}> {
  hasKey(): boolean;
  setKey(
    e: Element,
    key: DeepObjectKeys<T, 5>,
    revertKey?: DeepObjectKeys<T, 5>,
  ): void;
  setValue(val: string): void;
}

export function asyncKeySetter<T extends Constructor<AsyncKeySetter>>(constructor: T) {
  return class extends constructor {
    private _key: string;

    public hasKey(): boolean {
      return !!this._key;
    }

    public setKey(
      e: Element,
      key: DeepObjectKeys<T, 5>,
      revertKey?: DeepObjectKeys<T, 5>,
    ) {
      this._key = key;
      e.onEndTag(() => {
        this._key = revertKey;
      });
    }

    public setValue(val: string) {
      if (this._key) {
        const spl = this._key.split('.');
        let k = spl.shift();
        let obj = this as unknown as Record<string, string>;
        while (spl.length) {
          obj = obj[k] as unknown as Record<string, string>;
          k = spl.shift();
        }
        if (!obj[k]) {
          obj[k] = '';
        }
        obj[k] += val;
      }
    }
  };
}
