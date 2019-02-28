const Subscription = require("egg").Subscription;
const request = require("superagent");
const SuperagentProxy = require("superagent-proxy");
const cheerio = require("cheerio");
SuperagentProxy(request);

/**
 * 爬取代理
 */

class proxyCrawl extends Subscription {
  // constructor() {
  //   this.proxyList = [];
  //   this.headers = {
  //     "Content-Type": "application/json",
  //     Accept:
  //       "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  //     "Accept-Encoding": "gzip, deflate",
  //     "Accept-Language": "zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4",
  //     "User-Agent":
  //       "Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
  //     referer: "https://www.xicidaili.com/"
  //   };
  // }
  static get schedule() {
    return {
      // interval: "5s",
      cron: "0 0 */1 * * *", // 1小时爬一次
      type: "all" // 指定所有的 worker 都需要执行
    };
  }

  /**
   * 初始化表
   */
  async initTable() {
    const proxy_rows = await this.ctx.model.Proxy.find({});
    if (proxy_rows.length < 5) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 获取一条代理ip
   */
  async getProxy() {}

  /**
   * 抓取代理ip数据
   * 存入数据库
   */
  async subscribe() {
    let isNoData = await this.initTable();
    if (isNoData) {
      let { data } = await this.ctx.curl("http://www.qydaili.com/free/");
      data = data.toString();
      let $ = cheerio.load(data);
      let proxyText = $("tbody tr");
      let proxyData = [];
      proxyText.each(function(index, item) {
        let $this = $(item);
        let proxy = $this
          .find("td")
          .first()
          .text();
        proxyData.push({ proxy });
      });

      try {
        await this.ctx.model.Proxy.create(proxyData);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

module.exports = proxyCrawl;
