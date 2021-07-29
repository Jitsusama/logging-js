const pino = require("pino");

/**
 * Retrieve a logger.
 * @param {string} layer - software layer to associate logger with
 * @param {string} level - logging level
 * @returns {pino.Logger}
 */
const getLogger = (layer, level) => {
  if (!children.has(layer)) children.set(layer, parent.child({ layer, level }));
  return children.get(layer);
};

module.exports = { getLogger };

const reformatLevel = (level) => ({ level });

/** @type {Map<string, pino.Logger>} */
const children = new Map();

/** @type {pino.Logger} */
const parent = pino({
  base: {},
  formatters: { level: reformatLevel },
  mixin() {
    return { msg: undefined };
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});
