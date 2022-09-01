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

export interface BodyNodeBase {
  type: string;
  data: string;
  'html-data': string;
  [key: string]: string | number;
}

export interface ImageNode extends BodyNodeBase {
  type: 'image';
  'alt-text': string;
  credit: string;
  caption: string;
  'html-caption': string;
  width: number;
  height: number;
}

export type BodyNode = ImageNode | BodyNodeBase;

export interface Author {
  name: string;
  uri: string;
  url: string;
  role: string;
}

export interface Hit {
  metadata: {
    type: string;
    extensions: {
      'key': string;
      'value': string;
    }[];
    annotations: {
      'name': string;
      'uri': string;
    }[];
    'tmg-display-date': string;
    'tmg-last-modified-date': string;
    [key: string]: unknown;
  }
  content: {
    headline: string;
    standfirst?: string;
    authors: Author[];
    body: BodyNode[];
  }
}

export interface TemplateOptions {
  title: string;
  meta: {
    canonicalLink: string;
    description: string;
    tags: string[];
    createDate: string;
    modifyDate: string;
    type: string;
  };
  image: {
    url: string;
    alt: string;
    credit?: string;
    width: number;
    height: number;
  };
  authors: Author[];
  extensions: {
    twitterSite: string;
    webChannelUrl: string;
  };
  headline: string;
  standfirst?: string;
  content: string;
}
