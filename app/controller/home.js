"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "higg";
  }

  async crawl() {
    const { ctx } = this;
    let data = await ctx.service.crawl.fetch();
    try {
      let result = await ctx.model.Work.create(data);
      ctx.body = {
        code: 0,
        msg: "存入数据成功"
      };
    } catch (error) {
      console.log(error);
    }
  }

  async sendCode() {
    const { email } = this.ctx.request.body;
    const emailOptions = {
      from: "812510003@qq.com",
      subject: "注册验证码",
      to: email,
      text: "xxxxx"
    };

    let result = await this.ctx.service.sendCode.send(emailOptions);
    if (!result) {
      this.ctx.body = {
        code: -1,
        msg: "发送失败"
      };
    } else {
      this.ctx.body = {
        code: 0,
        msg: "发送成功"
      };
    }
  }
}

module.exports = HomeController;
