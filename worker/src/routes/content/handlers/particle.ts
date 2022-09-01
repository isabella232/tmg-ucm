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
 *   "type": "particle",
 *   "subtype": "embed",
 *   "data": "87e26d6f-8926-475d-9851-50cdf873b00d",
 *   "html-data": "<iframe layout=\"responsive\" sandbox=\"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms\" resizable=\"\" src=\"https://cf-particle-html.eip.telegraph.co.uk/87e26d6f-8926-475d-9851-50cdf873b00d.html\" scrolling=\"no\" frameborder=\"0\" data-business-type=\"editorial\"></iframe>",
 *   "alt-text": "Ukraine war - featured articles"
 * }
 *
 * Output:
 * <div class="embed">
 *   <div>
 *     <div>
 *       <a href="https://cf-particle-html.eip.telegraph.co.uk/87e26d6f-8926-475d-9851-50cdf873b00d.html">Ukraine war - featured articles</a>
 *     </div>
 *   </div>
 * </div>
 */
export default (node: BodyNode, ctx: Context): string => {
  if (['embed', 'illustrator-embed'].includes(node.subtype as string)) {
    return `\
<div class="embed">
  <div>
    <div>
      <a href="https://cf-particle-html.eip.telegraph.co.uk/${node.data}.html">${node['alt-text']}</a>
    </div>
  </div>
</div>`;
  }

  return node['html-data'];
};
