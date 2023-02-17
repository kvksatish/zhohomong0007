const mongoose = require("mongoose");

// Set strictQuery to false to prepare for Mongoose 7 deprecation
mongoose.set("strictQuery", false);

const datascheme = new mongoose.Schema({
    data: Array
});

const DataModel = mongoose.model("data", datascheme);

module.exports = { DataModel };