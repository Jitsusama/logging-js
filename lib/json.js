const pino = require("pino");
const { streamSym } = require("pino/lib/symbols.js");
const { BaseLogger } = require("./base.js");

/**
 * Retrieve/create a JSON logger.
 * @param {string} layer - software layer to associate logger with
 * @param {string} [level] - logging level
 * @returns {JsonLogger}
 */
const getLogger = (layer, level) => {
  if (!children.has(layer)) children.set(layer, new JsonLogger(layer, level));
  return children.get(layer);
};

module.exports = { getLogger };

/** @type {Map<string, JsonLogger>} */
const children = new Map();

class JsonLogger extends BaseLogger {
  constructor(layer, level) {
    super(layer, level);
    this.logger = pino({
      base: {},
      formatters: { level: (level) => ({ level }) },
      level: "trace",
      mixin() {
        return { layer, msg: undefined };
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
    Object.assign(this, { [streamSym]: this.logger[streamSym] });
  }

  log(level, object, template, ...parameters) {
    this.logger[level](object, template, ...parameters);
  }
}
