/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1551234870698_9998";

  // add your middleware config here
  config.middleware = [];

  // mongoose 配置
  config.mongoose = {
    client: {
      url: "mongodb://127.0.0.1/crawl",
      options: {}
    }
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ["http://localhost:8080"]
  };

  config.onerror = {
    json(err, ctx) {
      const { code, httpStatusCode, httpMsg } = err;
      if (httpStatusCode) ctx.statusCode = httpStatusCode;
      ctx.body = {
        code,
        msg: httpMsg
      };
    }
  };

  return {
    ...config,
    ...userConfig
  };
};
