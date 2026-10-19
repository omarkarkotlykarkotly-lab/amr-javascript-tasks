import test from "node:test";
import assert from "node:assert/strict";
import { WEB_DEV_LESSONS } from "./data.js";
import { filterQuestions, normalizeText, clampNumber } from "./utils.js";

test("provides ten beginner lessons across HTML, CSS, and JavaScript", () => {
  assert.equal(WEB_DEV_LESSONS.length, 10);
  assert.equal(WEB_DEV_LESSONS.filter((lesson) => lesson.category === "HTML").length, 3);
  assert.equal(WEB_DEV_LESSONS.filter((lesson) => lesson.category === "CSS").length, 3);
  assert.equal(WEB_DEV_LESSONS.filter((lesson) => lesson.category === "JavaScript").length, 4);
  assert.ok(WEB_DEV_LESSONS.every((lesson) => lesson.question && lesson.answer && lesson.example));
});

test("normalizes repeated spaces and case", () => {
  assert.equal(normalizeText("  HTML   Basics "), "html basics");
});

test("filters the lesson title without case sensitivity", () => {
  const result = filterQuestions(WEB_DEV_LESSONS, "semantic html");
  assert.deepEqual(result.map((lesson) => lesson.value), ["html-semantic"]);
});

test("search includes explanatory text and code examples", () => {
  assert.equal(filterQuestions(WEB_DEV_LESSONS, "assistive technologies")[0]?.value, "html-semantic");
  assert.equal(filterQuestions(WEB_DEV_LESSONS, "box-sizing")[0]?.value, "css-box-model");
  assert.equal(filterQuestions(WEB_DEV_LESSONS, "javascript").length >= 1, true);
});

test("category names are searchable", () => {
  assert.equal(filterQuestions(WEB_DEV_LESSONS, "CSS").length, 3);
});

test("returns a copy of all items for an empty query", () => {
  const result = filterQuestions(WEB_DEV_LESSONS, "   ");
  assert.deepEqual(result, WEB_DEV_LESSONS);
  assert.notEqual(result, WEB_DEV_LESSONS);
});

test("does not mutate the source collection", () => {
  const source = [...WEB_DEV_LESSONS];
  filterQuestions(source, "hooks");
  assert.deepEqual(source, WEB_DEV_LESSONS);
});

test("clamps an invalid or out-of-range item count", () => {
  assert.equal(clampNumber("10", 4, 10, 10), 10);
  assert.equal(clampNumber("6", 4, 10, 10), 6);
  assert.equal(clampNumber("not a number", 4, 10, 10), 10);
});