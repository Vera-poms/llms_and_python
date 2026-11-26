import type { CodeHint } from "./codeHints";
import { lab01Hints } from "./labHints/lab01";
import { lab02Hints } from "./labHints/lab02";
import { lab03Hints } from "./labHints/lab03";
import { lab04Hints } from "./labHints/lab04";
import { lab05Hints } from "./labHints/lab05";
import { lab06Hints } from "./labHints/lab06";
import { lab07Hints } from "./labHints/lab07";
import { lab08Hints } from "./labHints/lab08";
import { lab09Hints } from "./labHints/lab09";
import { lab10Hints } from "./labHints/lab10";
import { lab11Hints } from "./labHints/lab11";
import { lab12Hints } from "./labHints/lab12";
import { lab13Hints } from "./labHints/lab13";
import { lab14Hints } from "./labHints/lab14";
import { lab15Hints } from "./labHints/lab15";
import { lab16Hints } from "./labHints/lab16";
import { lab17Hints } from "./labHints/lab17";
import { lab18Hints } from "./labHints/lab18";
import { lab19Hints } from "./labHints/lab19";
import { project01Hints } from "./labHints/project01";
import { project02Hints } from "./labHints/project02";
import { project03Hints } from "./labHints/project03";
import { project04Hints } from "./labHints/project04";
import { project05Hints } from "./labHints/project05";
import { project06Hints } from "./labHints/project06";
import { project07Hints } from "./labHints/project07";
import { project08Hints } from "./labHints/project08";
import { project09Hints } from "./labHints/project09";
import { project10Hints } from "./labHints/project10";
import { project11Hints } from "./labHints/project11";
import { project12Hints } from "./labHints/project12";
import { project13Hints } from "./labHints/project13";
import { project14Hints } from "./labHints/project14";
import { project15Hints } from "./labHints/project15";
import { project16Hints } from "./labHints/project16";
import { project17Hints } from "./labHints/project17";
import { project18Hints } from "./labHints/project18";
import { project19Hints } from "./labHints/project19";

// Hover hints for the starter code in an exercise cell (the editor the student types in). They replace
// long docstrings, TODO comments and the per-function instructions in the notebook. Each lab has its own
// file in ./labHints exporting a list of `{ match, hints }`: `match` is a piece of that cell's starter code
// that picks the lab, `hints` are the hover hints.
const EDITOR_HINTS: { match: string; hints: CodeHint[] }[] = [
  ...lab01Hints,
  ...lab02Hints,
  ...lab03Hints,
  ...lab04Hints,
  ...lab05Hints,
  ...lab06Hints,
  ...lab07Hints,
  ...lab08Hints,
  ...lab09Hints,
  ...lab10Hints,
  ...lab11Hints,
  ...lab12Hints,
  ...lab13Hints,
  ...lab14Hints,
  ...lab15Hints,
  ...lab16Hints,
  ...lab17Hints,
  ...lab18Hints,
  ...lab19Hints,
  ...project01Hints,
  ...project02Hints,
  ...project03Hints,
  ...project04Hints,
  ...project05Hints,
  ...project06Hints,
  ...project07Hints,
  ...project08Hints,
  ...project09Hints,
  ...project10Hints,
  ...project11Hints,
  ...project12Hints,
  ...project13Hints,
  ...project14Hints,
  ...project15Hints,
  ...project16Hints,
  ...project17Hints,
  ...project18Hints,
  ...project19Hints,
];

// Hints for an exercise cell's starter code, or undefined when the lab has none.
export function editorHintsFor(code: string): CodeHint[] | undefined {
  const entries = EDITOR_HINTS.filter((entry) => code.includes(entry.match));
  return entries.length ? entries.flatMap((entry) => entry.hints) : undefined;
}
