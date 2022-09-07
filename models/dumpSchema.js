const mongoose = require("mongoose");
const { Schema } = mongoose;

const dumpSchema = new Schema({
  //    email: {
  //        type: String,
  //        required: true,
  //    },
  content: {
    type: String,
    required: true,
  },
  //    number: {
  //     type: Number,
  //     required: true,
  //    },
});

const Dumps = mongoose.model("Dumps", dumpSchema);

module.exports = Dumps;
