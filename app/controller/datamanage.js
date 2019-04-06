const { Controller } = require("egg");

class datamanageController extends Controller {
  async getCityList() {
    const { ctx } = this;
    const result = await ctx.model.City.find({});
    result.splice(0, 1);
    ctx.body = {
      code: 0,
      data: {
        result
      }
    };
  }

  async getWorkData() {
    const { ctx } = this;
    const { name, companyName, city, exp, edu, p, pageSize } = ctx.request.body;
    const result = await ctx.model.Work.find({
      jobTitle: { $regex: name, $options: "$i" },
      companyName: { $regex: companyName, $options: "$i" },
      workLocation: { $regex: city },
      workYear: { $regex: exp },
      academic: { $regex: edu }
    })
      .skip((p - 1) * pageSize)
      .limit(pageSize)
      .sort({ _id: 1 });

    let totalRows = await ctx.model.Work.count({
      jobTitle: { $regex: name, $options: "$i" },
      companyName: { $regex: companyName, $options: "$i" },
      workLocation: { $regex: city },
      workYear: { $regex: exp },
      academic: { $regex: edu }
    });
    ctx.body = {
      code: 0,
      totalRows,
      data: {
        result
      }
    };
  }

  async getUserData() {
    const { ctx } = this;
    const { name, email, p, pageSize } = ctx.request.body;
    const result = await ctx.model.User.find({
      username: { $regex: name },
      email: { $regex: email }
    })
      .skip((p - 1) * pageSize)
      .limit(pageSize)
      .sort({ _id: 1 });

    const totalRows = await ctx.model.User.count({
      username: { $regex: name, $options: "$i" },
      email: { $regex: email, $options: "$i" }
    });

    ctx.body = {
      code: 0,
      totalRows,
      data: {
        result
      }
    };
  }

  async getProxyData() {
    const { ctx } = this;
    const { p, pageSize } = ctx.request.body;
    let result = await ctx.model.Proxy.find({})
      .skip((p - 1) * pageSize)
      .limit(pageSize)
      .sort({ _id: 1 });
    let totalRows = await ctx.model.Proxy.count({});
    ctx.body = {
      code: 0,
      totalRows,
      data: { result }
    };
  }

  async addProxy() {
    const { ctx } = this;
    const { protocol, ip, port } = ctx.request.body;
    let proxy = `${protocol}://${ip}:${port}`;
    let result = await ctx.model.Proxy.create({ proxy });
    ctx.body = {
      code: 0,
      msg: "添加IP成功",
      data: {
        result
      }
    };
  }
}

module.exports = datamanageController;
