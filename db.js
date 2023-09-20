const mongoose = require('mongoose');
require("dotenv").config();
const mongoURI = process.env.REACT_APP_DATA_BASE;

const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(mongoURI);
      console.log("Connected to mongoDB successfully");
    } catch (error) {
      console.log(error);
      process.exit();
    }
  };
  module.exports = connectToMongo;