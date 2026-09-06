import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getEnv ,loadEnvironment} from "../config/env.js";

loadEnvironment();
const env = getEnv();

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadCropImage(
  file: Express.Multer.File,
  userId?: string
) {
  if (!env.AWS_S3_BUCKET) {
    throw new Error("AWS S3 bucket is not configured");
  }

  const extension =
    file.originalname.split(".").pop()?.toLowerCase() || "jpg";

  const key = `crop-images/${userId || "anonymous"}/${randomUUID()}.${extension}`;

  const uploadCommand = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(uploadCommand);

  const getObjectCommand = new GetObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: 3600,
  });

  return {
    key,
    url: signedUrl,
  };
}