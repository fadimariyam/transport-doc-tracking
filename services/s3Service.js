const s3 = require("../config/s3");
const { v4: uuid } = require("uuid");


const uploadFile = async (file) => {

  const key =
    uuid() + "-" + file.originalname;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3
    .upload(params)
    .promise();

  return result.Location;
};


const deleteFile = async (url) => {

  const key = url.split(".com/")[1];

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };

  await s3
    .deleteObject(params)
    .promise();
};


module.exports = {
  uploadFile,
  deleteFile,
};