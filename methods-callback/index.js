const fs = require("fs");

const data = "Hi! This is a test."

fs.writeFile("message.txt", data, (error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("File written successfully!");
});
