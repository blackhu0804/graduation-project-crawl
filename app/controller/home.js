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
    ctx.body = data;
  }
}

module.exports = HomeController;
