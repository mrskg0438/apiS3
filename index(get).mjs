import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
const s3 = new S3Client({ region: 'ap-south-1' });

const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

export const handler = async (event) => {
  const bucketName = "assignement-1";  
  const compiledData = [];

  try {
    const listCommand = new ListObjectsV2Command({ Bucket: bucketName });
    const listResponse = await s3.send(listCommand);

    const jsonFiles = listResponse.Contents.filter((file) =>
      file.Key.endsWith('.json')
    );

    for (const file of jsonFiles) {
      const getCommand = new GetObjectCommand({ Bucket: bucketName, Key: file.Key });
      const getResponse = await s3.send(getCommand);

      const fileContent = await streamToString(getResponse.Body);
      const jsonObject = JSON.parse(fileContent);
      compiledData.push(jsonObject);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(compiledData),
    };
  } catch (error) {
    console.error("Error fetching files:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorType: error.name,
        errorMessage: error.message,
      }),
    };
  }
};
