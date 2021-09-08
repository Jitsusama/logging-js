// noinspection JSCheckFunctionSignatures

const { BaseLogger } = require("./base.js");

/**
 * Retrieve/create a text logger.
 * @param {string} layer - software layer to associate logger with
 * @param {string} [level] - logging level
 * @returns {TextLogger}
 */
const getLogger = (layer, level) => {
  if (!children.has(layer)) children.set(layer, new TextLogger(layer, level));
  return children.get(layer);
};

module.exports = { getLogger };

/** @type {Map<string, TextLogger>} */
const children = new Map();

class TextLogger extends BaseLogger {
  constructor(layer, level) {
    super(layer, level);
  }

  log(level, object, template, ...parameters) {
    if (!console[level]) return;

    const date = new Date().toISOString().replace(/[:-]/g, "");
    const colors = {
      error: "red",
      warn: "orange",
      info: "green",
      debug: "blue",
    };

    console[level](
      `%c${date}%c ${level.toUpperCase()}%c [${this._layer}] ${template}`,
      "font-weight:normal",
      `font-weight:bold;color:${colors[level]}`,
      "font-style:inherit;font-weight:normal",
      ...parameters
    );
  }
}
