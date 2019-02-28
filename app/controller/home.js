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
    // let data = [{ jobTitle: "xxx" }];
    try {
      let result = await ctx.model.Work.create(data);
      ctx.body = {
        code: 0,
        data
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HomeController;
