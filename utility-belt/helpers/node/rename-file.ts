const fs = require("fs");
const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (file.endsWith(".js")) {
    fs.rename(file, file.replace(".js", ".ts"), (err) => {
      console.log(err);
    });
  }
}
