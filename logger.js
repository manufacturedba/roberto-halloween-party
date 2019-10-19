function applyToConsole(type) {
  // eslint-disable-next-line
  return console[type];
}

const logger = {
  info: applyToConsole('info'),
  debug: applyToConsole('debug'),
  error: applyToConsole('error'),
};

module.exports = logger;
