// MinIO Storage helpers - S3-compatible object storage

import { Client } from "minio";
import { ENV } from "./_core/env";

let minioClient: Client | null = null;

function getMinioClient(): Client {
  if (!minioClient) {
    const endpoint = ENV.minioEndpoint || "localhost";
    const port = ENV.minioPort || 9000;
    const useSSL = ENV.minioUseSSL || false;
    const accessKey = ENV.minioAccessKey;
    const secretKey = ENV.minioSecretKey;
    const bucketName = ENV.minioBucketName || "rag-documents";

    if (!accessKey || !secretKey) {
      throw new Error(
        "MinIO credentials missing: set MINIO_ACCESS_KEY and MINIO_SECRET_KEY environment variables"
      );
    }

    minioClient = new Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: accessKey,
      secretKey: secretKey,
    });

    // Ensure bucket exists
    minioClient.bucketExists(bucketName).then((exists) => {
      if (!exists) {
        return minioClient!.makeBucket(bucketName, "us-east-1");
      }
    }).catch((err) => {
      console.error("[MinIO] Error checking/creating bucket:", err);
    });
  }

  return minioClient;
}

function normalizeKey(key: string): string {
  return key.replace(/^\/+/, "");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getMinioClient();
  const bucketName = ENV.minioBucketName || "rag-documents";
  const key = normalizeKey(relKey);

  const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);

  try {
    await client.putObject(bucketName, key, buffer, buffer.length, {
      "Content-Type": contentType,
    });

    // Generate presigned URL (valid for 7 days)
    const url = await client.presignedGetObject(bucketName, key, 7 * 24 * 60 * 60);

    return { key, url };
  } catch (error) {
    console.error("[MinIO] Upload failed:", error);
    throw new Error(`Storage upload failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const client = getMinioClient();
  const bucketName = ENV.minioBucketName || "rag-documents";
  const key = normalizeKey(relKey);

  try {
    // Generate presigned URL (valid for 7 days)
    const url = await client.presignedGetObject(bucketName, key, 7 * 24 * 60 * 60);
    return { key, url };
  } catch (error) {
    console.error("[MinIO] Get failed:", error);
    throw new Error(`Storage get failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function storageDelete(relKey: string): Promise<void> {
  const client = getMinioClient();
  const bucketName = ENV.minioBucketName || "rag-documents";
  const key = normalizeKey(relKey);

  try {
    await client.removeObject(bucketName, key);
  } catch (error) {
    console.error("[MinIO] Delete failed:", error);
    throw new Error(`Storage delete failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
