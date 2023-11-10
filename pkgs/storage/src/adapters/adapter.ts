import { Readable } from 'node:stream';

import { NotImplementedError } from '../errors.js';
import { Bucket } from '../bucket.js';
import { BucketFile } from '../bucket-file.js';

abstract class Adapter {
  constructor() {}

  async init(): Promise<void> {
    throw new NotImplementedError('Adapter#init not implemented');
  }

  async listBuckets(): Promise<Bucket[]> {
    throw new NotImplementedError('Adapter#listBuckets not implemented');
  }

  async getFiles(
    _bucketName: string,
    _query?: GetFilesOptions,
  ): Promise<BucketFile[]> {
    throw new NotImplementedError('Adapter#getFiles not implemented');
  }

  async fileExists(_bucketName: string, _fileName: string): Promise<boolean> {
    throw new NotImplementedError('Adapter#fileExists not implemented');
  }

  async downloadFile(
    _bucketName: string,
    _fileName: string,
    _targetPath: string,
  ): Promise<void> {
    throw new NotImplementedError('Adapter#downloadFile not implemented');
  }

  async writeStream(
    _bucketName: string,
    _artifact: Buffer | Readable,
    _targetPath: string,
  ): Promise<string> {
    throw new NotImplementedError('Adapter#writeStream not implemented');
  }
}

// type GetFilesOptions = {
//   autoPaginate?: boolean;
//   delimiter?: string;
//   endOffset?: string;
//   includeTrailingDelimiter?: boolean;
//   prefix?: string;
//   matchGlob?: string;
//   maxApiCalls?: number;
//   maxResults?: number;
//   pageToken?: string;
//   startOffset?: string;
//   userProject?: string;
//   versions?: boolean;
// };
type GetFilesOptions = {
  autoPaginate?: boolean;
  delimiter?: string;
  endOffset?: string;
  includeTrailingDelimiter?: boolean;
  prefix?: string;
  matchGlob?: string;
  maxApiCalls?: number;
  maxResults?: number;
  pageToken?: string;
  startOffset?: string;
  // userProject?: string;
  versions?: boolean;
};

export { Adapter, GetFilesOptions };
