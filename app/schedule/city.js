const SubScription = require("egg").Subscription;
const request = require("superagent");

class cityCrawl extends SubScription {
  static get schedule() {
    return {
      // immediate: true,
      cron: "0 0 0 1 12 1", // 12小时爬一次
      type: "all"
    };
  }

  /**
   *  爬取热门城市
   */
  async subscribe() {
    console.log("爬取城市信息");
    let res = await this.ctx.curl(
      "https://www.zhipin.com/common/data/city.json"
    );
    let cityObj = Object.assign({}, JSON.parse(res.data.toString()));
    let hotCityList = cityObj.data.hotCityList;

    await this.ctx.model.City.create(hotCityList);
  }
}

module.exports = cityCrawl;
