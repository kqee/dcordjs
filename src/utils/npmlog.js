const log = require("npmlog");
const dt = new Date()

log.style.info.bg = "blue"
log.heading = dt.toLocaleString()

module.exports = log
