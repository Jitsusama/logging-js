const { BaseLogger } = require("./base.js");

describe("environment variable configuration", () => {
  test.each([
    ["trace", { a: "b" }, "hello", []],
    ["debug", { c: { d: 1 } }, "hola %s", ["dude"]],
    ["info", {}, "bonjour %d", [5]],
    ["warn", { e: ["f"] }, "word", []],
    ["error", {}, "howdy %s %s", ["groovy", "dude"]],
    ["fatal", { thing: 1 }, "yo", []],
  ])(
    "logs when logging level allows for it",
    (level, object, template, parameters) => {
      process.env.LOGGING_LEVEL = level;
      const logger = new TestLogger("env.1." + level);

      logger[level](object, template, ...parameters);

      expect(logger.mock).toBeCalledWith(
        level,
        object,
        template,
        ...parameters
      );
    }
  );

  test.each([
    ["silent", "error"],
    ["error", "info"],
  ])("does not log when logging level is set too low", (setLevel, logLevel) => {
    process.env.LOGGING_LEVEL = setLevel;
    const logger = new TestLogger("env.2." + logLevel);

    logger[logLevel]({}, "hello");

    expect(logger.mock).not.toBeCalled();
  });

  test.each([
    ["debug", "trace"],
    ["error", "info"],
  ])("logging level can be changed later", (first, second) => {
    process.env.LOGGING_LEVEL = first;
    const logger = new TestLogger("env.3." + second);

    logger.level = second;
    logger[second]({}, "hello");

    expect(logger.mock).toBeCalledWith(second, {}, "hello");
  });

  afterEach(() => {
    delete process.env.LOGGING_LEVEL;
  });
});

describe("local storage configuration", () => {
  test.each([
    ["trace", { a: "b" }, "hello", []],
    ["debug", { c: { d: 1 } }, "hola %s", ["dude"]],
    ["info", {}, "bonjour %d", [5]],
    ["warn", { e: ["f"] }, "word", []],
    ["error", {}, "howdy %s %s", ["groovy", "dude"]],
    ["fatal", { thing: 1 }, "yo", []],
  ])(
    "logs when logging level allows for it",
    (level, object, template, parameters) => {
      localStorage.setItem("LOGGING_LEVEL", level);
      const logger = new TestLogger("local.1." + level);

      logger[level](object, template, ...parameters);

      expect(logger.mock).toBeCalledWith(
        level,
        object,
        template,
        ...parameters
      );
    }
  );

  test.each([
    ["silent", "error"],
    ["error", "info"],
  ])("does not log when logging level is set too low", (setLevel, logLevel) => {
    localStorage.setItem("LOGGING_LEVEL", setLevel);
    const logger = new TestLogger("local.2." + logLevel);

    logger[logLevel]({}, "hello");

    expect(logger.mock).not.toBeCalled();
  });

  test.each([
    ["debug", "trace"],
    ["error", "info"],
  ])("logging level can be changed later", (first, second) => {
    localStorage.setItem("LOGGING_LEVEL", first);
    const logger = new TestLogger("local.3." + second);

    logger.level = second;
    logger[second]({}, "hello");

    expect(logger.mock).toBeCalledWith(second, {}, "hello");
  });

  afterEach(() => {
    localStorage.removeItem("LOGGING_LEVEL");
  });
});

test("when no level is provided, defaults to info", () => {
  const logger = new TestLogger("root.1");

  logger.debug({}, "hello");

  expect(logger.mock).not.toBeCalled();

  logger.info({}, "something");

  expect(logger.mock).toBeCalled();
});

class TestLogger extends BaseLogger {
  constructor(layer, level) {
    super(layer, level);
    this.mock = /** @type function */ jest.fn();
  }

  log(level, object, template, ...parameters) {
    this.mock(level, object, template, ...parameters);
  }
}
