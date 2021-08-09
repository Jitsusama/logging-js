// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const pino = require("pino");
const { streamSym } = require("pino/lib/symbols.js");
const { getLogger } = require("./index.js");

jest.useFakeTimers("modern");

test.each([
  ["trace", "1982-05-10T12:59:55.123Z", "1st", { a: "b" }, "hello"],
  ["debug", "1964-03-05T13:43:19.234Z", "2nd", { c: { d: 1 } }, "hola"],
  ["info", "1960-08-25T19:38:10.345Z", "3rd", {}, "bonjour"],
  ["warn", "1959-04-25T00:29:48.456Z", "4th", { e: ["f"] }, "word"],
  ["error", "1956-01-02T23:02:39.567Z", "5th", {}, "howdy"],
  ["fatal", "1954-10-01T08:14:21.678Z", "6th", { thing: 1 }, "yo"],
])(
  "logs when logging level allows for it",
  // eslint-disable-next-line unicorn/prevent-abbreviations
  (level, time, layer, object, msg) => {
    const logger = getLogger(layer, level);
    const stdout = jest.spyOn(logger[streamSym], "write");
    jest.setSystemTime(Date.parse(time));

    logger[level](object, msg);

    expect(stdout).toBeCalledWith(
      JSON.stringify({ level, time, layer, msg, ...object }) + "\n"
    );
  }
);

test.each([
  ["silent", "error"],
  ["error", "info"],
])("does not log when logging level is set too high", (setLevel, logLevel) => {
  const logger = getLogger("7th", setLevel);
  const stdout = jest.spyOn(logger[streamSym], "write");

  logger[logLevel]({}, "hello");

  expect(stdout).not.toBeCalled();
});

test.each([
  ["debug", "trace"],
  ["error", "info"],
])("logging level can be changed later", (first, second) => {
  const logger = getLogger("8th", first);
  const stdout = jest.spyOn(logger[streamSym], "write");

  logger.level = second;
  logger[second]({}, "hello");

  expect(stdout).toBeCalledWith(expect.stringMatching(/hello/));
});

test("when no level is provided, default to silent", () => {
  const logger = getLogger("9th");
  const stdout = jest.spyOn(logger[streamSym], "write");

  logger.info({}, "hello");

  expect(stdout).not.toBeCalled();
});

afterEach(() => {
  jest.restoreAllMocks();
});
