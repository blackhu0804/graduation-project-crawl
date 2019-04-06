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

  router.post("/getCityData", controller.data.cityData);
  router.post("/mapData", controller.data.mapData);
  router.post("/conpanyData", controller.data.conpanyData);
  router.post("/eduData", controller.data.getEduData);
  router.post("/experienceData", controller.data.getWorkExperienceData);

  router.get("/getCity", controller.datamanage.getCityList);
  router.post("/getWorkList", controller.datamanage.getWorkData);
  router.post("/getUserList", controller.datamanage.getUserData);
  router.post("/getProxyList", controller.datamanage.getProxyData);
  router.post("/addProxy", controller.datamanage.addProxy);
  router.post("/deleteProxy", controller.datamanage.deleteProxy);
  router.post("/updateProxy", controller.datamanage.updateProxy);
};
