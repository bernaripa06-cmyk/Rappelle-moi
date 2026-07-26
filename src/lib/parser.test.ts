import assert from "node:assert/strict";
import test from "node:test";
import { parseReminder } from "./parser";

const NOW = new Date("2026-07-26T10:00:00+07:00");

test("comprend un appel demain", () => {
  const reminder = parseReminder("Demain à 14h appeler Stefano", NOW);
  assert.equal(reminder.category, "call");
  assert.equal(reminder.title, "appeler Stefano");
  assert.equal(new Date(reminder.dueAt!).getHours(), 14);
});

test("comprend un délai en minutes", () => {
  const reminder = parseReminder("Dans 20 minutes sortir le gâteau", NOW);
  assert.equal(new Date(reminder.dueAt!).getTime() - NOW.getTime(), 20 * 60 * 1000);
});

test("classe une liste de courses", () => {
  const reminder = parseReminder("Ajoute beurre et café à la liste de courses", NOW);
  assert.equal(reminder.category, "shopping");
  assert.equal(reminder.dueAt, null);
});

test("comprend un anniversaire", () => {
  const reminder = parseReminder("Anniversaire de maman le 12 mars", NOW);
  assert.equal(reminder.category, "birthday");
  assert.equal(new Date(reminder.dueAt!).getFullYear(), 2027);
});
