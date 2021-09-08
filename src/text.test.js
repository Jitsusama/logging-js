const { getLogger } = require("./text.js");

jest.useFakeTimers("modern");

test.each([
  ["debug", "1964-03-05T13:43:19.234Z", "1st", "hola"],
  ["info", "1960-08-25T19:38:10.345Z", "2nd", "bonjour"],
  ["warn", "1959-04-25T00:29:48.456Z", "3rd", "hello"],
  ["error", "1956-01-02T23:02:39.567Z", "4th", "howdy"],
])("logs text messages", (level, time, layer, message) => {
  const logger = getLogger(layer, level);
  const stdout = jest.spyOn(process.stdout, "write");
  jest.setSystemTime(Date.parse(time));

  logger[level](message);

  expect(stdout).toBeCalledWith(
    expect.stringContaining(
      `${time.replace(
        /[:-]/g,
        ""
      )} ${level.toUpperCase()} [${layer}] ${message}`
    ),
    expect.anything()
  );
});

test("logs templated messages", () => {
  const logger = getLogger("5th", "info");
  const stdout = jest.spyOn(process.stdout, "write");

  logger.info("%s has %d reasons to succeed", "joel", 9999);

  expect(stdout).toBeCalledWith(
    expect.stringMatching("joel has 9999 reasons to succeed"),
    expect.anything()
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});
