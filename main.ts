// The Funniest Office Joke, Judged Head to Head
// Writes one single-line office joke to $MAKEFUN_OUTPUT_DIR/entry.txt
// (or /output/entry.txt when the variable is unset, as the sandbox runs it).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "The office printer only jams on deadline day, so I promoted it to middle management \u2014 it senses urgency and immediately stops working.";

function fail(message: string): never {
  console.error(`invalid joke: ${message}`);
  process.exit(1);
}

function validate(joke: string): void {
  if (joke.length < 1 || joke.length > 200) {
    fail(`length ${joke.length} is outside 1-200 characters`);
  }
  if (joke.trim().length === 0) {
    fail("joke is only whitespace");
  }
  if (joke !== joke.trim()) {
    fail("joke has leading or trailing whitespace");
  }
  if (joke.includes("\n") || joke.includes("\r")) {
    fail("joke must be a single line");
  }
  const words = joke.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 5) {
    fail(`only ${words.length} words, need at least 5`);
  }
  for (const ch of joke) {
    if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
      fail("joke contains a control character");
    }
  }
}

const outDir =
  process.argv[2] || process.env.MAKEFUN_OUTPUT_DIR || "/output";
validate(JOKE);
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, JOKE, "utf8");

// Read back and confirm exactly what was written.
const written = readFileSync(outFile, "utf8");
if (written !== JOKE) {
  fail("read-back mismatch: entry.txt does not match the joke");
}
console.log(`wrote ${JOKE.length} characters to ${outFile}`);
