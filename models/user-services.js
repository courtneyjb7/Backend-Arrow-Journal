const mongoose = require("mongoose");
const userModel = require("./userSchema.js");
const entryModel = require("./entrySchema.js");
const dumpModel = require("./dumpSchema.js");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

dotenv.config();

mongoose.set("debug", true);

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.MONGO_USER +
      ":" +
      process.env.MONGO_PWD +
      "@" +
      process.env.MONGO_CLUSTER +
      ".eqoej.mongodb.net/" +
      process.env.MONGO_DB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((error) => console.log(error)); //need test coverage??

async function addUser(user) {
  try {
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(user);
    console.log(error);
    return false;
  }
}

async function deleteUser(email){
  
  const result = await userModel.deleteOne({ email: email }); 
  console.log(result);
  return result;
}

async function findUserByEmail(email) {
  return await userModel.find({ email: email });
}

async function addEntry(entry, email) {
  try {
    const user = await findUserByEmail(email);
    const id = user[0]._id;
    var user_entries = user[0].entries;
    // console.log(user)
    // //check if entry exists
    // console.log("user_entry: " + user_entries)
    const exists = await findEntryByDateAndType(
      entry.date,
      email,
      entry.entry_type
    );
    console.log(exists);

    if (exists !== undefined) {
      const date = entry.date;
      const type = entry.entry_type;
      // console.log(user_entries[0].date)
      // console.log(user_entries[0].date===entry.date)
      user_entries = user_entries.filter((t) => {
        return t.date !== entry.date;
      });
    }
    // console.log(user_entries)
    const entry_to_add = new entryModel(entry);
    user_entries.push(entry_to_add);
    // console.log(current_entries);

    const saved_entry = await userModel.updateOne(
      { _id: id },
      { $set: { entries: user_entries } }
    );

    return saved_entry;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findEntryByDateAndType(date, email, type) {
  try {
    const user = await findUserByEmail(email);
    const id = user[0]._id;
    var current_entries = user[0].entries;

    var result = current_entries.find(
      (t) => t.date === date && t.entry_type === type
    );
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addDump(dump, email) {
  try {
    const user = await findUserByEmail(email);
    const id = user[0]._id;
    var user_dumps = user[0].dumps;

    const dump_to_add = new dumpModel(dump);
    user_dumps.push(dump_to_add);

    const acknowledgement = await userModel.updateOne(
      { _id: id },
      { $set: { dumps: user_dumps } }
    );

    console.log(acknowledgement);
    return dump;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function editOneDump(id, email, new_dump){
  try {   
    const user = await findUserByEmail(email);
    const user_id = user[0]._id;
    var user_dumps = user[0].dumps;
    
    const dump_obj_id = new ObjectId(id);

    console.log("New dump: "+ new_dump);
    console.log("id: ", id)

    for (var i=0; i < user_dumps.length; i++){
      var dump = user_dumps[i];
      console.log("compare dump: "+dump_obj_id.equals(dump._id))
      if (dump_obj_id.equals(dump._id)){
        console.log("og dump: "+user_dumps[i])
        user_dumps[i].content = new_dump.content;
        console.log("updated dump: "+user_dumps[i])

      }
    } 
    console.log("user_dumps: "+user_dumps);

    const aknowledgement = await userModel.updateOne(
      { _id: user_id },
      { $set: { dumps: user_dumps } }
    );

    console.log(aknowledgement );

    return aknowledgement;
  }
  catch (error) {
    console.log(error);
    return false;
  }
  
}

async function deleteDump(id, email) {
  try {
    const user = await findUserByEmail(email);
    const user_id = user[0]._id;
    var user_dumps = user[0].dumps;
    console.log(id);
    const objId = new ObjectId(id);
    console.log(objId);
    var result_dumps = user_dumps.filter((t) => !objId.equals(t._id));
    console.log(result_dumps);

    const aknowledgement  = await userModel.updateOne(
      { _id: user_id },
      { $set: { dumps: result_dumps } }
    );

    console.log(aknowledgement );

    return aknowledgement ;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function fetchAllDumps(email) {
  try {
    const user = await findUserByEmail(email);
    const user_id = user[0]._id;
    var user_dumps = user[0].dumps;

    // console.log(user_dumps)
    return user_dumps;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function fetchAllEntries(email) {
  try {
    const user = await findUserByEmail(email);
    var user_entries = user[0].entries;
    return user_entries;
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports.addUser = addUser;
exports.findUserByEmail = findUserByEmail;
exports.addEntry = addEntry;
exports.findEntryByDateAndType = findEntryByDateAndType;
exports.addDump = addDump;
exports.deleteDump = deleteDump;
exports.fetchAllDumps = fetchAllDumps;
exports.fetchAllEntries = fetchAllEntries;
exports.editOneDump = editOneDump;
exports.deleteUser = deleteUser;