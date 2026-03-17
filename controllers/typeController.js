const {
  getTypes,
  addType,
} = require("../models/typeModel");


const getAllTypes = async (req, res) => {

  const category =
    req.query.category;

  const data =
    await getTypes(category);

  res.json(data);

};


const createType = async (req, res) => {

  const { name, category } =
    req.body;

  const data =
    await addType(
      name,
      category
    );

  res.json(data);

};


module.exports = {
  getAllTypes,
  createType,
};