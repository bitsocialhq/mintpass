import { test } from "node:test";
import assert from "node:assert/strict";
import ChallengeFileFactory from "../dist/mintpass.js";

const VALID_OPTIONS = {
  chainTicker: "base",
  contractAddress: "0x13d41d6B8EA5C86096bb7a94C3557FCF184491b9",
  requiredTokenType: "0",
  transferCooldownSeconds: "604800",
  bindToFirstAuthor: "true",
  noChallengeUrl: "false",
  rpcUrl: "http://127.0.0.1:8545"
};

const validate = (challengeSettings) => {
  const { validateChallengeSettings } = ChallengeFileFactory({ challengeSettings });
  validateChallengeSettings({ challengeSettings });
};

const validateWith = (optionOverrides, extra = {}) =>
  validate({ options: { ...VALID_OPTIONS, ...optionOverrides }, ...extra });

test("factory exposes a sync validateChallengeSettings hook", () => {
  const challengeFile = ChallengeFileFactory({ challengeSettings: {} });
  assert.equal(typeof challengeFile.validateChallengeSettings, "function");
  assert.equal(challengeFile.validateChallengeSettings.constructor.name, "Function"); // not AsyncFunction
});

test("accepts valid options", () => {
  assert.doesNotThrow(() => validateWith({}));
  assert.doesNotThrow(() => validateWith({ bindToFirstAuthor: "1", noChallengeUrl: "0" }));
  assert.doesNotThrow(() => validateWith({ bindToFirstAuthor: "FALSE", noChallengeUrl: "True" }));
  assert.doesNotThrow(() => validateWith({ contractAddress: "0x13d41d6b8ea5c86096bb7a94c3557fcf184491b9" })); // lowercase
  assert.doesNotThrow(() => validate({ options: undefined }));
  assert.doesNotThrow(() => validate({ options: VALID_OPTIONS, publicOptions: ["chainTicker", "contractAddress", "requiredTokenType", "noChallengeUrl", "error"] }));
});

test("rejects malformed contractAddress", () => {
  for (const contractAddress of ["", "0x123", "not-an-address", "0x13d41d6B8EA5C86096bb7a94C3557FCF184491b"]) {
    assert.throws(() => validateWith({ contractAddress }), /contractAddress/, `expected rejection for "${contractAddress}"`);
  }
});

test("rejects non-integer requiredTokenType", () => {
  for (const requiredTokenType of ["", "-1", "1.5", "abc", "0abc"]) {
    assert.throws(() => validateWith({ requiredTokenType }), /requiredTokenType/, `expected rejection for "${requiredTokenType}"`);
  }
});

test("rejects non-integer transferCooldownSeconds", () => {
  for (const transferCooldownSeconds of ["", "-1", "1.5", "1 week", "NaN"]) {
    assert.throws(() => validateWith({ transferCooldownSeconds }), /transferCooldownSeconds/, `expected rejection for "${transferCooldownSeconds}"`);
  }
});

test("rejects non-boolean bindToFirstAuthor and noChallengeUrl", () => {
  for (const value of ["", "yes", "no", "ture", "2"]) {
    assert.throws(() => validateWith({ bindToFirstAuthor: value }), /bindToFirstAuthor/, `expected rejection for "${value}"`);
    assert.throws(() => validateWith({ noChallengeUrl: value }), /noChallengeUrl/, `expected rejection for "${value}"`);
  }
});

test("rejects rpcUrl in publicOptions", () => {
  assert.throws(() => validateWith({}, { publicOptions: ["rpcUrl"] }), /rpcUrl/);
  assert.throws(() => validateWith({}, { publicOptions: ["chainTicker", "rpcUrl"] }), /rpcUrl/);
});
