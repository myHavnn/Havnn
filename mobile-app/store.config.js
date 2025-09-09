/* eslint-disable @typescript-eslint/no-var-requires */
// Use the data from `eas metadata:pull`
const config = require("./store.config.json");
const appJson = require("./app.json");

config.apple.version = appJson.expo.version;
config.apple.info["en-US"].releaseNotes = "Bug fixes";

module.exports = config;
