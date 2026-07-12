import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const qaEnvironment = Object.fromEntries(
  readFileSync(new URL("../.env.qa.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

const child = spawn(
  process.execPath,
  ["--use-system-ca", "./node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", "3100"],
  {
    env: {
      ...process.env,
      // Browser tests must never inherit the production Supabase target.
      ...qaEnvironment,
      SUPABASE_SERVICE_ROLE_KEY: "",
      EMAIL_PROVIDER: "disabled",
      RESEND_API_KEY: "",
      BREVO_API_KEY: "",
      OPENROUTER_API_KEY: "",
      GEMINI_API_KEY: "",
    },
    stdio: "inherit",
  },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code) => process.exit(code ?? 0));
