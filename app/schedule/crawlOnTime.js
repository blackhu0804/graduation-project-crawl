const Subscription = require("egg").Subscription;

class updataCrawl extends Subscription {
  static get schedule() {
    return {
      // interval: "5s",
      cron: "0 0 */12 * * *", // 12小时爬一次
      type: "all" // 指定所有的 worker 都需要执行
    };
  }

  async subscribe() {
    let data = await this.ctx.service.crawl.fetch();
    let result = await this.ctx.model.Work.create(data);
    console.log("1111");
    console.log(result);
  }
}

module.exports = updataCrawl;
