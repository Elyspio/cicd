const { spawn } = require("child_process");

spawn("docker", ["buildx", "bake", "--push"], { cwd: __dirname, stdio: "inherit" });
