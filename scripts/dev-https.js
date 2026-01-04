const { spawn } = require("node:child_process");
const path = require("node:path");

const scriptDir = __dirname;
const isWindows = process.platform === "win32";

const child = isWindows
  ? spawn("cmd.exe", ["/c", path.join(scriptDir, "dev-https.bat")], { stdio: "inherit" })
  : spawn("bash", [path.join(scriptDir, "dev-https.sh")], { stdio: "inherit" });

child.on("exit", (code) => {
  process.exit(typeof code === "number" ? code : 1);
});
