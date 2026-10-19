import test from "node:test";
import assert from "node:assert/strict";
import { filterQuestions, normalizeText, clampNumber } from "./utils.js";

const questions = [
  { question: "What is the Virtual DOM?", answer: "An in-memory representation of the UI." },
  { question: "What are React Hooks?", answer: "Hooks add state and effects to function components." },
  { question: "When should you use useEffect?", answer: "Synchronize with an external system." }
];

test("normalizes repeated spaces and case", () => {
  assert.equal(normalizeText("  REACT   Hooks "), "react hooks");
});

test("filters question text case-insensitively", () => {
  assert.deepEqual(filterQuestions(questions, "virtual dom"), [questions[0]]);
});

test("filters answer text as well as question text", () => {
  assert.deepEqual(filterQuestions(questions, "external system"), [questions[2]]);
});

test("returns a copy of all items for an empty query", () => {
  const result = filterQuestions(questions, "   ");
  assert.deepEqual(result, questions);
  assert.notEqual(result, questions);
});

test("does not mutate the source collection", () => {
  const source = [...questions];
  filterQuestions(source, "hooks");
  assert.deepEqual(source, questions);
});

test("clamps an invalid or out-of-range item count", () => {
  assert.equal(clampNumber("10", 4, 8, 8), 8);
  assert.equal(clampNumber("6", 4, 8, 8), 6);
  assert.equal(clampNumber("not a number", 4, 8, 8), 8);
});
