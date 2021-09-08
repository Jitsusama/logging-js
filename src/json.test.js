// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const pino = require("pino");
const { streamSym } = require("pino/lib/symbols.js");
const { getLogger } = require("./json.js");

jest.useFakeTimers("modern");

test.each([
  ["trace", "1982-05-10T12:59:55.123Z", "1st", { a: "b" }, "hello"],
  ["debug", "1964-03-05T13:43:19.234Z", "2nd", { c: { d: 1 } }, "hola"],
  ["info", "1960-08-25T19:38:10.345Z", "3rd", {}, "bonjour"],
  ["warn", "1959-04-25T00:29:48.456Z", "4th", { e: ["f"] }, "word"],
  ["error", "1956-01-02T23:02:39.567Z", "5th", {}, "howdy"],
  ["fatal", "1954-10-01T08:14:21.678Z", "6th", { thing: 1 }, "yo"],
])("logs JSON messages", (level, time, layer, object, message) => {
  const logger = getLogger(layer, level);
  const stdout = jest.spyOn(logger[streamSym], "write");
  jest.setSystemTime(Date.parse(time));

  logger[level](object, message);

  expect(stdout).toBeCalledWith(
    JSON.stringify({ level, time, layer, msg: message, ...object }) + "\n"
  );
});

test("logs templated messages", () => {
  const logger = getLogger("7th", "info");
  const stdout = jest.spyOn(logger[streamSym], "write");

  logger.info({}, "%s has %d reasons to succeed", "joel", 9999);

  expect(stdout).toBeCalledWith(
    expect.stringMatching("joel has 9999 reasons to succeed")
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});
