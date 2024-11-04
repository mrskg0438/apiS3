import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'ap-south-1' });
export const handler = async (event) => {
  const bucketName = "assignement-1";  // Replace with your bucket name
  
  try {
    if (!event.body) {
      throw new Error("Request body is missing");
    }

    const jsonData = JSON.parse(event.body);

    // Generate a unique file name using timestamp and random number
    const fileName = `file_${Date.now()}_${Math.floor(Math.random() * 10000)}.json`;

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: JSON.stringify(jsonData),
      ContentType: "application/json",
    });

    const putResponse = await s3.send(putCommand);
    const s3Link = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    const eTag = putResponse.ETag;

    return {
      statusCode: 200,
      body: JSON.stringify({
        e_tag: eTag,
        s3_link: s3Link,
      }),
    };
  } catch (error) {
    console.error("Unhandled error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorType: error.name,
        errorMessage: `${error}  ${event.requestContext}`,
      }),
    };
  }
}
