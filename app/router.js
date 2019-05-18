"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  /**
   * @apiVersion 0.1.0
   * @api {GET} /isLogin 是否登录
   * @apiGroup User_General 
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Bollean} data.hasLogin 是否登录
   * @apiSuccessExample Success-Response:
   * {
   *  "code": 0,
   *  "data": {
   *    "hasLogin": true
   *  }
   * }
   */

  router.get("/isLogin", controller.user.index);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /user 创建用户
   * @apiGroup User_General 
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * @apiParam {String} email 邮箱
   * @apiParam {String} code 验证码
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {String} msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    msg: "注册成功"
   * }
   */
  router.post("/user", controller.user.createUser);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /login 登录
   * @apiGroup User_General 
   * 
   * @apiParam {String} username 用户名
   * @apiParam {String} password 密码
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {String} data.msg 提示信息
   * @apiSuccess {String} data.username 用户名
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *      msg: "登录成功",
   *      username: "black"
   *    }
   * }
   */
  router.post("/login", controller.user.loginWithUnPw);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /logout 登出
   * @apiGroup User_General 
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {String} data.msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *      msg: "退出成功",
   *    }
   * }
   */
  router.post("/logout", controller.user.logout);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /retrieve 修改密码
   * @apiGroup User_General 
   * 
   * @apiParam {String} password 密码
   * @apiParam {String} email 邮箱
   * @apiParam {String} code 验证码
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {String} data.msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *      msg: "修改密码成功，请重新登录",
   *    }
   * }
   */
  router.post("/retrieve", controller.user.retrieve);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /sendVerifyCode 发送验证码
   * @apiGroup User_General 
   * 
   * @apiParam {String} password 密码
   * @apiParam {String} email 邮箱
   * @apiParam {String} type 验证码类别，0注册，1修改密码
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {String} data.msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *      msg: "验证码发送成功",
   *    }
   * }
   */
  router.post("/sendVerifyCode", controller.user.sendVerifyCode);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /checkCode 校验验证码
   * @apiGroup User_General 
   * 
   * @apiParam {String} code 验证码
   * @apiParam {String} email 邮箱
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {String} data.msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *      msg: "验证验证码成功",
   *    }
   * }
   */
  router.post("/checkCode", controller.user.checkCode);


  /**
   * @apiVersion 0.1.0
   * @api {POST} /getCityData 获取城市数据
   * @apiGroup  Main_page
   * 
   * @apiParam {String} city 城市
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {String} data.workCount 职位数量
   * @apiSuccess {Array} data.classify 职位分布
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     workCount : 100,
   *     classify: [
   *        {name: "前端", value: 200 },
   *        {name: "算法", value: 300 },
   *      ]
   *    }
   * }
   */
  router.post("/getCityData", controller.data.cityData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /mapData 获取地图数据
   * @apiGroup  Main_page
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 职位分布
   * @apiSuccess {String} data.result._id 城市名
   * @apiSuccess {String} data.result.count 职位数量
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [
   *        {_id: "北京", count: 200 },
   *        {_id: "上海", count: 200 },
   *      ]
   *    }
   * }
   */
  router.post("/mapData", controller.data.mapData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /conpanyData 公司规模分布
   * @apiGroup  Main_page
   * 
   * @apiParam {String} city 城市
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 公司规模
   * @apiSuccess {String} data.result._id 融资轮数
   * @apiSuccess {String} data.result.count 公司数量
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [
   *        {_id: "A轮", count: 200 },
   *        {_id: "已上市", count: 200 },
   *      ]
   *    }
   * }
   */
  router.post("/conpanyData", controller.data.conpanyData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /eduData 学历需求分布
   * @apiGroup  Main_page
   * 
   * @apiParam {String} city 城市
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 职位学历需求分布
   * @apiSuccess {String} data.result._id 学历
   * @apiSuccess {String} data.result.count 数量
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [
   *        {_id: "本科", count: 200 },
   *        {_id: "硕士", count: 200 },
   *      ]
   *    }
   * }
   */
  router.post("/eduData", controller.data.getEduData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /experienceData 工作经验分布
   * @apiGroup  Main_page
   * 
   * @apiParam {String} city 城市
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 职位工作经验分布
   * @apiSuccess {String} data.result._id 工作经验
   * @apiSuccess {String} data.result.count 数量
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [
   *        {_id: "1-3年", count: 200 },
   *        {_id: "经验不限", count: 200 },
   *      ]
   *    }
   * }
   */
  router.post("/experienceData", controller.data.getWorkExperienceData);

  /**
   * @apiVersion 0.1.0
   * @api {POST} /getCity 获得城市列表
   * @apiGroup  Data_Manange
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 职位工作经验分布
   * @apiSuccess {String} data.result.code 城市代号
   * @apiSuccess {String} data.result.name 城市名
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [
   *        {code: "123123", name: 北京 },
   *        {code: "2134", name: 上海 },
   *      ]
   *    }
   * }
   */
  router.get("/getCity", controller.datamanage.getCityList);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /getWorkList 获得职位列表
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} name 职位名
   * @apiParam {String} companyName 公司名
   * @apiParam {String} city 城市
   * @apiParam {String} exp 经验要求
   * @apiParam {String} edu 学历要求
   * @apiParam {String} p 当前页
   * @apiParam {String} pageSize 一页显示条数
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 职位列表
   * @apiSuccess {String} data.result.academic 学历
   * @apiSuccess {String} data.result.companyCategory 公司行业
   * @apiSuccess {String} data.result.companyCategory 公司行业
   * @apiSuccess {String} data.result.companyName 公司名
   * @apiSuccess {String} data.result.finance 融资情况
   * @apiSuccess {String} data.result.jobTitle 职位名称
   * @apiSuccess {String} data.result.peopleCount 公司人数
   * @apiSuccess {String} data.result.regionCode 公司所在地区编号
   * @apiSuccess {String} data.result.regionName 公司所在地区
   * @apiSuccess {String} data.result.salary 公司薪资水平
   * @apiSuccess {String} data.result.workLocation 工作地点
   * @apiSuccess {String} data.result.workYear 经验要求
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [
   *        {
   *          academic: "本科"
   *          companyCategory: "互联网"
   *          companyName: "阿里巴巴集团"
   *          finance: "不需要融资"
   *          href: "https://www.zhipin.com/job_detail/27a4d4a3ec06a54d1XJ73t27E1Q~.html"
   *          jobTitle: "前端开发专家"
   *          peopleCount: "10000人以上"
   *          regionCode: "101280100"
   *          regionName: "广州"
   *          salary: "20k-40k"
   *          workLocation: "广州"
   *          workYear: "经验不限"
   *        },
   *      ]
   *    }
   * }
   */
  router.post("/getWorkList", controller.datamanage.getWorkData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /getUserList 获得用户列表
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} name 用户名
   * @apiParam {String} email 邮箱
   * @apiParam {String} p 当前页
   * @apiParam {String} pageSize 一页显示条数
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 用户列表
   * @apiSuccess {String} data.result.email 邮箱
   * @apiSuccess {String} data.result.username 用户名
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [{
   *        email: "邮箱",
   *        usernmae: "用户名"
   *      }]
   *    }
   * }
   */
  router.post("/getUserList", controller.datamanage.getUserData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /getProxyList 获得代理列表
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} p 当前页
   * @apiParam {String} pageSize 一页显示条数
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object} data 数据
   * @apiSuccess {Array} data.result 代理列表
   * @apiSuccess {String} data.result.ip 代理IP地址
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *     result: [{
   *        ip: "http:129.213.14.23:8080"
   *     }]
   * }
   */
  router.post("/getProxyList", controller.datamanage.getProxyData);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /addProxy 添加代理
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} protocol 协议
   * @apiParam {String} ip IP地址
   * @apiParam {String} port 端口
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {String}  msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    msg: "添加代理成功"
   * }
   */
  router.post("/addProxy", controller.datamanage.addProxy);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /deleteProxy 删除代理
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} proxy 代理
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {String}  msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    msg: "删除代理成功"
   * }
   */
  router.post("/deleteProxy", controller.datamanage.deleteProxy);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /updateProxy 更新代理
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} proxy 代理
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {String}  msg 提示信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    msg: "更新代理成功"
   * }
   */
  router.post("/updateProxy", controller.datamanage.updateProxy);
  /**
   * @apiVersion 0.1.0
   * @api {POST} /getWorkInfo 获取职位详细信息
   * @apiGroup  Data_Manange
   * 
   * @apiParam {String} url 职位链接
   * 
   * @apiSuccess {Integer} code 响应码
   * @apiSuccess {Object}  data 职位信息
   * @apiSuccess {String}  data.workInfo 职位详细信息
   * @apiSuccessExample Success-Response:
   * {
   *    code: 0,
   *    data: {
   *      workInfo: 'xxxx'
   *    }
   * }
   */
  router.post('/getWorkInfo', controller.datamanage.getWorkInfo)
};
