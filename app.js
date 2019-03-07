const path = require("path");

module.exports = app => {
  app.loader.loadToApp(path.join(app.config.baseDir, "app/error"), "error", {
    caseStyle: "upper"
  });
};
