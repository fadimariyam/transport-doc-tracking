const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
});

module.exports = s3;