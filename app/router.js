"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get("/", controller.home.index);
  // router.get("/data", controller.home.crawl);

  router.get("/isLogin", controller.user.index);
  router.post("/user", controller.user.createUser);
  router.post("/login", controller.user.loginWithUnPw);
  router.post("/logout", controller.user.logout);
  router.post("/retrieve", controller.user.retrieve);
  router.post("/sendVerifyCode", controller.user.sendVerifyCode);
  router.post("/checkCode", controller.user.checkCode);
};
