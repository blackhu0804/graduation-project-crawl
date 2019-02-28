const Subscription = require("egg").Subscription;

class updataCrawl extends Subscription {
  static get schedule() {
    return {
      cron: "0 0 */12 * * *", // 12小时爬一次
      type: "all" // 指定所有的 worker 都需要执行
    };
  }

  async subscribe() {
    let result = await this.ctx.service.crawl.fetch();
    console.log(result);
  }
}

module.exports = updataCrawl;
