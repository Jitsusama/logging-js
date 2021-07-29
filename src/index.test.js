// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const pino = require("pino");
const { streamSym } = require("pino/lib/symbols.js");
const { getLogger } = require("./index.js");

jest.useFakeTimers("modern");

test.each([
  ["trace", "1964-03-05T13:43:19.123Z", "1st", { a: "b" }, "hello"],
  ["debug", "1960-08-25T19:38:10.234Z", "2nd", {}, "bonjour"],
  ["info", "1959-04-25T00:29:48.345Z", "3rd", { c: { d: 1 } }, "word"],
  ["warn", "1956-01-02T23:02:39.456Z", "4th", {}, "howdy"],
  ["error", "1954-10-01T08:14:21.567Z", "5th", { thing: 1 }, "yo"],
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
  const logger = getLogger("test", setLevel);
  const stdout = jest.spyOn(logger[streamSym], "write");

  logger[logLevel]({}, "hello");

  expect(stdout).not.toBeCalled();
});

afterEach(() => {
  jest.restoreAllMocks();
});
