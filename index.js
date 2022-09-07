const express = require("express");
const mongoose = require("mongoose");

// Add mongdb user services
const userServices = require("./models/user-services.js");

const app = express();
const port = 5000;
const cors = require("cors");
const { resolveConfigFile } = require("prettier");

app.use(cors());
app.use(express.json());

app.get("/entry/:email", async (req, res) => {
  const email = req.params.email;
  const entry = await userServices.fetchAllEntries(email);
  console.log(entry);
  res.status(200).send(entry);
});

app.get("/entry/:email/:date/:type", async (req, res) => {
  const date = req.params.date;
  const email = req.params.email;
  const type = req.params.type;
  let result = await userServices.findEntryByDateAndType(date, email, type);

  if (result === undefined || result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    result = { entries_list: result };
    res.send(result);
  }
});

app.post("/entry/:email", async (req, res) => {
  const entry = req.body;
  const email = req.params.email;

  const result = await userServices.addEntry(entry, email);

  console.log(result);
  res.send(result);
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/dumps/:email", async (req, res) => {
  const email = req.params.email;
  const dumps = await userServices.fetchAllDumps(email);
  console.log(dumps);
  res.send(dumps);
});

app.get("/dumps/:id", (req, res) => {
  const id = req.params.id;
  let result = findDumpById(id);

  if (result === undefined || result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    result = { dumps_list: result };
    res.send(result);
  }
});

function findDumpById(id) {
  return dumps["dumps_list"].find((dump) => dump["id"] === id);
}

app.post("/dumps/:email", async (req, res) => {
  const dumpToAdd = req.body;
  const email = req.params.email;

  const dump = await userServices.addDump(dumpToAdd, email);

  res.status(201).send(dump);
});

app.delete("/dumps/:email/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.params.email;
  // const dumpToDelete = findDumpToDelete(id);
  const result = await userServices.deleteDump(id, email);

  if (result === undefined || result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).end();
  }
});

app.put("/dumps/:email/:id", async (req, res) => {
  const id = req.params.id;
  const dumpToUpdate = req.body;
  const email = req.params.email;
  // const result = editDumpById(id, dumpToUpdate);
  console.log(id);
  const result =  await userServices.editOneDump(id, email, dumpToUpdate);

  if (result === undefined || result.length === 0) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(201).send(result);
  }
});

// function editDumpById(id, dumpToUpdate) {
//   const updatedDump = findDumpById(id);
//   if (updatedDump !== undefined) {
//     updatedDump.content = dumpToUpdate.content;
//   }
//   return updatedDump;
// }
