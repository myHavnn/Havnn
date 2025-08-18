const admin = require("firebase-admin");
const triggers = require("./triggers");
const callables = require("./callables");

admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

module.exports = {
  ...triggers,
  ...callables,
};
