import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { UploadPath } from './uploadPath';

@Injectable()
export class UploadImageServce {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  private readonly s3 = new AWS.S3();

  constructor(private configService: ConfigService) {
    AWS.config.update({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.s3;
  }

  async upload(
    uploadPath: UploadPath,
    username: string,
    image?: Express.Multer.File,
  ) {
    const key = `${Date.now() + image.originalname}`;
    const params = {
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}/${uploadPath}/${username}`,
      ACL: 'public-read',
      Key: key,
      Body: image.buffer,
    };
    return new Promise((resolve, reject) => {
      this.s3.putObject(params, (err) => {
        if (err) reject(err);
        resolve(key);
      });
    });
  }
}
