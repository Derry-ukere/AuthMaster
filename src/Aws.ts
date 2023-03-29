import aws, { S3 } from 'aws-sdk';

export const awsS3 = (): S3 => {
  const keys = {
    accessKeyId: <string>process.env.S3_ACCESS_KEY,
    secretAccessKey: <string>process.env.S3_SECRET_KEY,
  };

  return new aws.S3({
    ...keys,
    credentials: keys,
    useAccelerateEndpoint: true,
    region: process.env.S3_REGION,
  });
};
