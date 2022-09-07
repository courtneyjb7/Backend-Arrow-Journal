const userServices = require("../models/user-services.js");

test("Adding New User -- pass", async () => {
  const user = {
    name: "Courtney Barber",
    email: "fake@email.com",
    entries: [
      {
        user_email: "fake@email.com",
        date: "5-20-2022",
        entry_type: "Academic",
      },
      {
        user_email: "fake@email.com",
        date: "5-22-2022",
        entry_type: "Personal",
      },
    ],
  };
  var added = await userServices.addUser(user);
  //console.log(added);
  expect(added.name).toBe("Courtney Barber");
  expect(added.email).toBe("fake@email.com");
});

test("Adding New User -- fail", async () => {
  const user = {
    name: "Courtney Barber",
    entries: [
      {
        user_email: "fake@email.com",
        date: "5-20-2022",
        entry_type: "Academic",
      },
      {
        user_email: "fake@email.com",
        date: "5-22-2022",
        entry_type: "Personal",
      },
    ],
  };

  var added = await userServices.addUser(user);
  //console.log(added);
  expect(added).toBeFalsy();
});

test("Finding user by email -- pass", async () => {
  const email = "fake@email.com";

  var found = await userServices.findUserByEmail(email);
  //console.log(found[0])
  expect(found[0].name).toBe("Courtney Barber");
  expect(found[0].email).toBe("fake@email.com");
});

test("Finding user by email -- fail", async () => {
  const email = "fake2@email.com";

  var found = await userServices.findUserByEmail(email);
  expect(found.name).toBe(undefined);
});

test("Adding new entry -- pass", async () => {
  const new_entry = { date: "5-30-2022", entry_type: "Work", content: "hello" };

  const email = "fake@email.com";
  const add_entry = await userServices.addEntry(new_entry, email);

  expect(add_entry.acknowledged).toBeTruthy();
});

test("Adding new entry -- pass", async () => {
  const new_entry = { date: "5-30-2022", entry_type: "Work", content: "bye" };

  const email = "fake@email.com";
  const add_entry = await userServices.addEntry(new_entry, email);

  expect(add_entry.acknowledged).toBeTruthy();
});

test("Adding new entry -- fail", async () => {
  const new_entry = { date: "5-27-2022", entry_type: "Personal" };

  const email = "v@calpoly.edu";
  const add_entry = await userServices.addEntry(new_entry, email);

  expect(add_entry).toBeFalsy();
});

test("Getting Entry -- pass", async () => {
  const email = "fake@email.com";
  const date = "5-30-2022";
  const type = "Work";
  const entry = await userServices.findEntryByDateAndType(date, email, type);
  const expected_entry = { date: "5-30-2022", entry_type: "Work" };

  expect(entry.entry_type).toBe(expected_entry.entry_type);
  expect(entry.date).toBe(expected_entry.date);
  expect(entry.user_email).toBe(expected_entry.user_email);
});

test("Getting Entry -- fail", async () => {
  const email = "cb@calpoly.edu"; //finding user has to fail
  const date = "120-100-2022";
  const type = "Personal";
  const entry = await userServices.findEntryByDateAndType(date, email, type);
  expect(entry).toBeFalsy();
});

test("Fetch All Entries -- pass", async () => {
  const email = "fake@email.com";
  const entry_list = await userServices.fetchAllEntries(email);
  // console.log(entry_list);
  const size = 3;
  expect(entry_list.length).toBe(size);
});

test("Fetch All Entries -- fail", async () => {
  const email = "fake2@email.com";

  const result = await userServices.fetchAllEntries(email);
  expect(result).toBeFalsy();
});

test("Adding Dump -- pass 1", async () => {
  const email = "fake@email.com";
  const dump = { content: "dump#1" };

  const result = await userServices.addDump(dump, email);
  expect(result.content).toBe(dump.content);
});
test("Adding Dump -- pass 2", async () => {
  const email = "fake@email.com";
  const dump = { content: "dump#2" };

  const result = await userServices.addDump(dump, email);
  expect(result.content).toBe(dump.content);
});

test("Adding Dump -- fail", async () => {
  const email = "fake@calpoly.edu";
  const dump = { content: "test" };

  const result = await userServices.addDump(dump, email);
  expect(result).toBeFalsy();
});

test("Fetch All Dumps -- pass", async () => {
  const email = "fake@email.com";
  const dump_list = await userServices.fetchAllDumps(email);
  console.log(dump_list);
  const size = 2;
  expect(dump_list.length).toBe(size);
});

test("Fetch All Dumps -- fail", async () => {
  const email = "fake2@email.com";

  const result = await userServices.fetchAllDumps(email);
  expect(result).toBeFalsy();
});

test("Delete Dump -- pass", async () => {
  const email = "fake@email.com";
  const dump = { content: "dump#2" };

  const all_dumps = await userServices.fetchAllDumps(email);

  const first_dump_id = all_dumps[0]._id;
  console.log(first_dump_id);

  const result = await userServices.deleteDump(first_dump_id, email);
  expect(result.acknowledged).toBeTruthy();
});

test("Delete Dump -- fail", async () => {
  const email = "fake@calpoly.edu";
  const dump = { content: "test" };

  const result = await userServices.deleteDump(dump, email);
  expect(result).toBeFalsy();
});

test("Edit Dump -- pass", async () => {
  const email = "fake@email.com";
  const dump = { content: "edited dump" };

  const all_dumps = await userServices.fetchAllDumps(email);

  const first_dump_id = all_dumps[0]._id;
  
  const result = await userServices.editOneDump(first_dump_id, email, dump);
  expect(result.acknowledged).toBeTruthy();
})

test("Edit Dump -- fail", async () => {
  const new_dump = {content: "edited dump"}
  const email = "doesNotExist@email.com";
  const placeholder_id = "001";
  const result = await userServices.editOneDump(placeholder_id, email, new_dump);

  expect(result.acknowledged).toBeFalsy();
})

test("Delete User -- pass", async () => {
  const email = "fake@email.com";
  const result = await userServices.deleteUser(email);
  expect(result.acknowledged).toBeTruthy();
})