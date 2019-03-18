const { Controller } = require("egg");

class dataController extends Controller {
  async cityData() {
    const { ctx } = this;
    const { city } = ctx.request.body;

    const work = await ctx.model.Work.count({ regionName: city });
    // 前端职位数量
    const feCount = await ctx.model.Work.count({
      regionName: city,
      jobTitle: { $regex: /前端/ }
    });
    // 客户端
    const clientCount = await ctx.model.Work.count({
      regionName: city,
      jobTitle: { $regex: /Android|ios/ }
    });
    // 后端
    const backCount = await ctx.model.Work.count({
      regionName: city,
      jobTitle: { $regex: /php|java|go|node|后端/ }
    });
    const dataCount = await ctx.model.Work.count({
      regionName: city,
      jobTitle: { $regex: /大数据/ }
    });
    // 算法
    const mathCount = await ctx.model.Work.count({
      regionName: city,
      jobTitle: { $regex: /数据挖掘|算法|深度学习|机器|人工智能/ }
    });
    const productCount = await ctx.model.Work.count({
      regionName: city,
      jobTitle: { $regex: /产品|运维|测试/ }
    });
    const elseCount =
      work -
      feCount -
      clientCount -
      backCount -
      mathCount -
      productCount -
      dataCount;
    ctx.body = {
      code: 0,
      data: {
        workCount: work,
        classify: [
          { name: "前端", value: feCount },
          { name: "客户端", value: clientCount },
          { name: "后端", value: backCount },
          { name: "大数据", value: dataCount },
          { name: "算法", value: mathCount },
          { name: "产品|测试", value: productCount },
          { name: "其他", value: elseCount }
        ]
      }
    };
  }

  async mapData() {
    const { ctx } = this;
    const result = await ctx.model.Work.aggregate([
      { $group: { _id: "$workLocation", count: { $sum: 1 } } }
    ]);
    ctx.body = {
      code: 0,
      data: {
        result
      }
    };
  }

  async conpanyData() {
    const { ctx } = this;
    const { city } = ctx.request.body;
    const result = await ctx.model.Work.aggregate([
      {
        $match: { workLocation: city }
      },
      {
        $group: {
          _id: "$finance",
          count: {
            $sum: 1
          }
        }
      }
    ]);
    let sortRet = result.sort(function(obj1, obj2) {
      let val1 = obj1._id;
      let val2 = obj2._id;
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      }
    });

    ctx.body = {
      code: 0,
      data: {
        sortRet
      }
    };
  }
}

module.exports = dataController;
