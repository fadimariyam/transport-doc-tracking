const {
  createDocument,
  getDocuments,
  deleteDocument,
} = require("../models/documentModel");

const {
  uploadFile,
  deleteFile,
} = require("../services/s3Service");


// ✅ UPLOAD DOCUMENT
const uploadDoc = async (req, res) => {
  try {

    const {
      item_type,
      item_id,
      name,
      expiry,
    } = req.body;

    const file = req.file;

    // ✅ check file exists
    if (!file) {
      return res
        .status(400)
        .json("File not provided");
    }

    // ✅ upload to S3
    const url = await uploadFile(file);

    // ✅ save to DB
    const doc = await createDocument(
      item_type,
      item_id,
      name,
      expiry,
      url
    );

    res.json(doc);

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);
  }
};


// ✅ LIST DOCUMENTS
const listDocs = async (req, res) => {
  try {

    const { item_type, item_id } =
      req.query;

    const docs = await getDocuments(
      item_type,
      item_id
    );

    res.json(docs);

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }
};


// ✅ DELETE DOCUMENT
const removeDoc = async (req, res) => {
  try {

    const id = req.params.id;
     if (!id)
      return res
        .status(400)
        .json("ID missing");

    const doc =
      await deleteDocument(id);

    if (!doc)
      return res
        .status(404)
        .json("Not found");

    // delete from S3
    if (doc.url) {
      await deleteFile(doc.url);
    }

    res.json("deleted");

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }
};


module.exports = {
  uploadDoc,
  listDocs,
  removeDoc,
};