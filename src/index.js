const { loadConfig } = require("./config");

const config = loadConfig();

console.log(config.sfmc.gliders);
