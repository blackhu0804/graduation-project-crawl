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
      .sort({ _id: -1 });

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
}

module.exports = datamanageController;
