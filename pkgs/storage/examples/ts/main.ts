import fs from 'node:fs';
import { resolve } from 'node:path';
import { Storage, StorageType } from '@evereactor/storage';

const LOCAL_ADAPTER_ENABLED =
  process.env.LOCAL_ADAPTER_ENABLED == 'true' || false;
const GCS_ADAPTER_ENABLED = process.env.GCS_ADAPTER_ENABLED == 'true' || false;
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
const GCS_BUCKET = process.env.GCS_BUCKET;
const HELLO_TXT = 'hello.txt';

(async () => {
  console.log('Examples');
  console.log('====================');
  console.log('LOCAL_ADAPTER_ENABLED: %o', LOCAL_ADAPTER_ENABLED);
  console.log('GCS_ADAPTER_ENABLED: %o', GCS_ADAPTER_ENABLED);
  console.log('');

  /**
   * LocalAdapter
   */
  if (LOCAL_ADAPTER_ENABLED) {
    const LOCAL_STORAGE_DIR = '.examples/storage/ts';
    const LOCAL_BUCKET_1 = 'local-bucket-1';
    const LOCAL_BUCKET_2 = 'local-bucket-2';

    const localAdapter = Storage({
      type: StorageType.LOCAL,
      directory: LOCAL_STORAGE_DIR,
    });
    await localAdapter.init();
    console.log('LocalAdapter');
    console.log('====================');

    fs.mkdirSync(`${LOCAL_STORAGE_DIR}/${LOCAL_BUCKET_1}`, { recursive: true });
    fs.mkdirSync(`${LOCAL_STORAGE_DIR}/${LOCAL_BUCKET_2}`, { recursive: true });
    fs.writeFileSync(`${LOCAL_STORAGE_DIR}/other-file.txt`, '');
    const localBuckets = await localAdapter.listBuckets();
    console.log('#listBuckets');
    localBuckets.forEach((b) => {
      console.log(`  - ${b.name}`);
    });

    fs.writeFileSync(
      `${LOCAL_STORAGE_DIR}/${LOCAL_BUCKET_1}/bucket-1-file.txt`,
      '',
    );
    fs.writeFileSync(
      `${LOCAL_STORAGE_DIR}/${LOCAL_BUCKET_2}/bucket-2-file.txt`,
      '',
    );
    const localFilesBeforeWrite = await localAdapter.getFiles(LOCAL_BUCKET_1);
    console.log(`#getFiles - ${LOCAL_BUCKET_1}`);
    console.log(`  - total=${localFilesBeforeWrite.length}`);

    const localFileExistsBeforeDownload = await localAdapter.fileExists(
      LOCAL_BUCKET_1,
      HELLO_TXT,
    );
    console.log(`#fileExists - ${LOCAL_BUCKET_1}`);
    console.log(`  - ${localFileExistsBeforeDownload}`);

    const localHelloReadable = fs.createReadStream(
      resolve(`examples/ts/${HELLO_TXT}`),
    );
    const localWriteStreamPublicUrl = await localAdapter.writeStream(
      LOCAL_BUCKET_1,
      localHelloReadable,
      HELLO_TXT,
    );
    console.log(`#writeStream - ${LOCAL_BUCKET_1}`);
    console.log(`  - publicUrl=${localWriteStreamPublicUrl}`);

    const localFilesAfterWrite = await localAdapter.getFiles(LOCAL_BUCKET_1);
    console.log(`#getFiles - ${LOCAL_BUCKET_1}`);
    console.log(`  - total=${localFilesAfterWrite.length}`);

    const localFileExistsAfterDownload = await localAdapter.fileExists(
      LOCAL_BUCKET_1,
      HELLO_TXT,
    );
    console.log(`#fileExists - ${LOCAL_BUCKET_1}`);
    console.log(`  - ${localFileExistsAfterDownload}`);

    fs.mkdirSync('.examples/downloads/local', { recursive: true });
    await localAdapter.downloadFile(
      LOCAL_BUCKET_1,
      HELLO_TXT,
      `.examples/downloads/local/${HELLO_TXT}`,
    );
    console.log(`#downloadFile - ${LOCAL_BUCKET_1}`);

    console.log('');
  }

  /**
   * GCSAdapter
   */
  if (GCS_ADAPTER_ENABLED && GCS_PROJECT_ID && GCS_BUCKET) {
    const gcsAdapter = Storage({
      type: StorageType.GCS,
      keyFilename: '.local/gcp_service_account.json',
      projectId: GCS_PROJECT_ID,
    });
    await gcsAdapter.init();
    console.log('GCSAdapter');
    console.log('====================');

    // TODO:
    // - verify IAM
    // const gcsBuckets = await gcs.listBuckets();
    // console.log('gcs buckets: %o', gcsBuckets.length);

    const gcsFilesBeforeWrite = await gcsAdapter.getFiles(GCS_BUCKET);
    console.log(`#getFiles - ${GCS_BUCKET}`);
    console.log(`  - total=${gcsFilesBeforeWrite.length}`);

    const gcsFileExistsBeforeDownload = await gcsAdapter.fileExists(
      GCS_BUCKET,
      HELLO_TXT,
    );
    console.log(`#fileExists - ${GCS_BUCKET}`);
    console.log(`  - ${gcsFileExistsBeforeDownload}`);

    const gcsHelloReadable = fs.createReadStream(
      resolve(`examples/ts/${HELLO_TXT}`),
    );
    const gcsWriteStreamPublicUrl = await gcsAdapter.writeStream(
      GCS_BUCKET,
      gcsHelloReadable,
      HELLO_TXT,
    );
    console.log(`#writeStream - ${GCS_BUCKET}`);
    console.log(`  - publicUrl=${gcsWriteStreamPublicUrl}`);

    const gcsFilesAfterWrite = await gcsAdapter.getFiles(GCS_BUCKET);
    console.log(`#getFiles - ${GCS_BUCKET}`);
    console.log(`  - total=${gcsFilesAfterWrite.length}`);

    const gcsFileExistsAfterDownload = await gcsAdapter.fileExists(
      GCS_BUCKET,
      HELLO_TXT,
    );
    console.log(`#fileExists - ${GCS_BUCKET}`);
    console.log(`  - ${gcsFileExistsAfterDownload}`);

    fs.mkdirSync('.examples/downloads/gcs', { recursive: true });
    await gcsAdapter.downloadFile(
      GCS_BUCKET,
      HELLO_TXT,
      `.examples/downloads/gcs/${HELLO_TXT}`,
    );
    console.log(`#downloadFile - ${GCS_BUCKET}`);
  }
})();
