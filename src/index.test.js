// noinspection JSUnusedLocalSymbols
// eslint-disable-next-line no-unused-vars
const pino = require("pino");
const { streamSym } = require("pino/lib/symbols.js");
const { getLogger } = require("./index.js");

jest.useFakeTimers("modern");

test.each([
  ["info", "1960-08-09T13:33:19.123Z", "something", {}, "hello world"],
  ["error", "1954-10-01T08:14:21.234Z", "other", { thing: 1 }, "yo"],
])(
  "logs when logging level allows for it",
  // eslint-disable-next-line unicorn/prevent-abbreviations
  (level, time, layer, parameters, msg) => {
    const logger = getLogger(layer, level);
    const stdout = jest.spyOn(logger[streamSym], "write");
    jest.setSystemTime(Date.parse(time));

    logger[level](parameters, msg);

    expect(stdout).toBeCalledWith(
      JSON.stringify({ level, time, layer, msg, ...parameters }) + "\n"
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
