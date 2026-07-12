import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const values = Object.fromEntries(
  readFileSync(resolve(process.cwd(), ".env.qa.local"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

export function qaValue(name: string) {
  const value = values[name];
  if (!value) throw new Error(`Missing ${name} in .env.qa.local`);
  return value;
}
