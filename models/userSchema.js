const mongoose = require("mongoose");
const { Schema } = mongoose;
const entrySchema = require("./entrySchema.js").schema;
const dumpSchema = require("./dumpSchema.js").schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    entries: [entrySchema],
    dumps: [dumpSchema],
  },
  { collection: "users_list" }
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
