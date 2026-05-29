import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | undefined;

function getR2Client(): S3Client {
  if (!client) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error("Credenciais do R2 ausentes — confira o .env.local");
    }
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

/** Envia um objeto ao bucket R2 e retorna a key utilizada. */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error("R2_BUCKET não definido");

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      // Cache agressivo: navegador/CDN guardam por 1 ano e não re-baixam do R2.
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return key;
}
