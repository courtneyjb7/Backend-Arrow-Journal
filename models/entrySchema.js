const mongoose = require("mongoose");
const { Schema } = mongoose;

const entrySchema = new Schema({
  //    user_email: {
  //        type: String,
  //        required: true,
  //    },
  date: {
    type: String,
    required: true,
  },
  entry_type: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
  },
  moodColor: {
    type: String,
  },
  moodIcon: {
    type: String,
  },
  free_write_response: {
    type: String,
  },
  positives_response: {
    type: String,
  },
  goals_response: {
    type: String,
  },
  random_question: {
    type: String,
  },
  random_answer: {
    type: String,
  },
});

const Entries = mongoose.model("Entries", entrySchema);

module.exports = Entries;
