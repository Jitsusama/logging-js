const pino = require("pino");
const { streamSym } = require("pino/lib/symbols.js");

/**
 * Retrieve a logger.
 * @param {string} layer - software layer to associate logger with
 * @param {string} level - logging level
 * @returns {SimpleLogger}
 */
const getLogger = (layer, level) => {
  if (!children.has(layer)) children.set(layer, new SimpleLogger(layer, level));
  return children.get(layer);
};

module.exports = { getLogger };

/** @type {Map<string, SimpleLogger>} */
const children = new Map();

class SimpleLogger {
  /**
   * Create a new simple logger.
   * @param {string} layer
   * @param {string} level
   */
  constructor(layer, level) {
    this.logger = pino({
      base: {},
      formatters: { level: (level) => ({ level }) },
      level,
      mixin() {
        return { layer, msg: undefined };
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
    Object.assign(this, { [streamSym]: this.logger[streamSym] });
  }

  /**
   * Trace log.
   * @param {any} object
   * @param {string} [template]
   * @param {...any} [parameters]
   */
  trace(object, template, ...parameters) {
    this.logger.trace(object, template, ...parameters);
  }

  /**
   * Debug log.
   * @param {any} object
   * @param {string} [template]
   * @param {...any} [parameters]
   */
  debug(object, template, ...parameters) {
    this.logger.debug(object, template, ...parameters);
  }

  /**
   * Informative log.
   * @param {any} object
   * @param {string} [template]
   * @param {...any} [parameters]
   */
  info(object, template, ...parameters) {
    this.logger.info(object, template, ...parameters);
  }

  /**
   * Warning log.
   * @param {any} object
   * @param {string} [template]
   * @param {...any} [parameters]
   */
  warn(object, template, ...parameters) {
    this.logger.warn(object, template, ...parameters);
  }

  /**
   * Error log.
   * @param {any} object
   * @param {string} [template]
   * @param {...any} [parameters]
   */
  error(object, template, ...parameters) {
    this.logger.error(object, template, ...parameters);
  }

  /**
   * Fatal log.
   * @param {any} object
   * @param {string} [template]
   * @param {...any} [parameters]
   */
  fatal(object, template, ...parameters) {
    this.logger.fatal(object, template, ...parameters);
  }
}
