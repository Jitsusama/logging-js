class BaseLogger {
  /**
   * Create a new logger.
   * @param {string} layer
   * @param {string} level
   */
  constructor(layer, level) {
    this._layer = layer;
    this._level = parseLevel(level);
  }

  /**
   * Change the current logging level.
   * @param {string} level
   */
  set level(level) {
    this._level = parseLevel(level);
  }

  /**
   * Trace log.
   * @param {any|string} object
   * @param {string|any} [template]
   * @param {...any} [parameters]
   */
  trace(object, template, ...parameters) {
    this._log("trace", object, template, ...parameters);
  }

  /**
   * Debug log.
   * @param {any|string} object
   * @param {string|any} [template]
   * @param {...any} [parameters]
   */
  debug(object, template, ...parameters) {
    this._log("debug", object, template, ...parameters);
  }

  /**
   * Informative log.
   * @param {any|string} object
   * @param {string|any} [template]
   * @param {...any} [parameters]
   */
  info(object, template, ...parameters) {
    this._log("info", object, template, ...parameters);
  }

  /**
   * Warning log.
   * @param {any|string} object
   * @param {string|any} [template]
   * @param {...any} [parameters]
   */
  warn(object, template, ...parameters) {
    this._log("warn", object, template, ...parameters);
  }

  /**
   * Error log.
   * @param {any|string} object
   * @param {string|any} [template]
   * @param {...any} [parameters]
   */
  error(object, template, ...parameters) {
    this._log("error", object, template, ...parameters);
  }

  /**
   * Fatal log.
   * @param {any|string} object
   * @param {string|any} [template]
   * @param {...any} [parameters]
   */
  fatal(object, template, ...parameters) {
    this._log("fatal", object, template, ...parameters);
  }

  /**
   * Log out a message.
   * @param {string} level
   * @param {any} object
   * @param {string} template
   * @param {...any} parameters
   */
  // eslint-disable-next-line no-unused-vars
  log(level, object, template, ...parameters) {}

  /**
   * @private
   * @param {string} level
   * @param {any} object
   * @param {string} template
   * @param {...any} parameters
   */
  _log(level, object, template, ...parameters) {
    if (levels[level] > levels[this._level]) return;
    if (typeof object === "string" || object instanceof String) {
      if (template) parameters.unshift(template);
      template = object;
      object = {};
    }
    this.log(level, object, template, ...parameters);
  }
}

module.exports = { BaseLogger };

const parseLevel = (level) =>
  level ||
  process?.env?.LOGGING_LEVEL ||
  window?.localStorage?.getItem("LOGGING_LEVEL") ||
  "silent";

// map logging levels to numeric values
const levels = {
  silent: 0,
  fatal: 5,
  error: 10,
  warn: 15,
  info: 20,
  debug: 25,
  trace: 30,
};
