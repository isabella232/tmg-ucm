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

import { Context } from '../../../types';
import { BodyNode } from '../types';

/**
 * Input:
 * {
 *   "type": "video",
 *   "data": "6AKdwmm2ap0",
 *   "html-data": "<iframe src=\"https://www.youtube.com/embed/6AKdwmm2ap0?enablejsapi=1&modestbranding=1&origin=http://www.telegraph.co.uk&rel=0\" data-embed-id=\"6AKdwmm2ap0\" allowfullscreen frameborder=\"0\"></iframe>"
 * }
 *
 * Output:
 * <div class="video">
 *   <div>
 *     <div>
 *       <a href="https://www.youtube.com/watch?v=6AKdwmm2ap0">https://www.youtube.com/watch?v=6AKdwmm2ap0</a>
 *     </div>
 *   </div>
 * </div>
 */
export default (node: BodyNode, _: Context): string => {
  if (node['html-data'].includes('youtube')) {
    return `\
<div class="video">
  <div>
    <div>
      <a href="https://www.youtube.com/watch?v=${node.data}">https://www.youtube.com/watch?v=${node.data}</a>
    </div>
  </div>
</div>`;
  }

  return node['html-data'];
};
