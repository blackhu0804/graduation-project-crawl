const Subscription = require("egg").Subscription;
const request = require("superagent");
const SuperagentProxy = require("superagent-proxy");
const fs = require("fs");
SuperagentProxy(request);

class updataCrawl extends Subscription {
  static get schedule() {
    return {
      interval: "5s",
      cron: "0 0 */12 * * *", // 12小时爬一次
      type: "all" // 指定所有的 worker 都需要执行
    };
  }

  /**
   * 取随机ip
   */
  async getProxy() {
    let proxyData = await this.ctx.model.Proxy.find();
    let proxyArr = [];
    proxyData.forEach(item => {
      proxyArr.push(item.proxy);
    });
    let ip = proxyArr[Math.floor(Math.random() * proxyArr.length)];
    return ip;
  }

  /**
   * 将网页解析存到mongodb
   */
  async saveData(data) {
    let $ = cheerio.load(data);
    let jobItem = $(".job-primary");
    jobItem.each(function(index, item) {
      let $this = $(item);
      let jobTitle = $this
        .find(".job-title")
        .first()
        .text();

      let companyName = $this
        .find(".company-text>.name>a")
        .first()
        .text();

      let salary = $this
        .find(".red")
        .first()
        .text();

      let href = $this
        .find(".info-primary>.name>a")
        .first()
        .attr("href");

      let regex = /\<em class="vline"\>\<\/em\>/g;
      let workPrimary = $this
        .find(".info-primary>p")
        .first()
        // .text();
        .html()
        .replace(regex, "|");

      workPrimary = unescape(
        workPrimary.replace(/&#x/g, "%u").replace(/;/g, "")
      );
      let [workLocation, workYear, academic] = workPrimary.split("|");

      let workCompony = $this
        .find(".company-text>p")
        .first()
        .html()
        .replace(regex, "|");
      workCompony = unescape(
        workCompony.replace(/&#x/g, "%u").replace(/;/g, "")
      );
      let [companyCategory, finance, peopleCount] = workCompony.split("|");

      items.push({
        jobTitle,
        companyName,
        salary,
        href: `https://www.zhipin.com${href}`,
        workLocation,
        workYear,
        academic,
        companyCategory,
        finance,
        peopleCount
      });
    });
  }

  /**
   * 请求网页获取网页内容
   */
  async subscribe() {
    let headers = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.6",
      Host: "www.dianping.com",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      referer: "https://www.zhipin.com/"
    };
    // 取随机ip
    let ip = await this.getProxy();
    console.log(ip);
    for (let page = 1; page <= 1; page++) {
      // this.ctx.logger.debug(`正在爬取boss第${page}页职位信息`);
      // let { data } = await ctx.curl(
      //   `https://www.zhipin.com/c101010100/?page=${page}&ka=page-${page}`
      // );
      try {
        await request
          .get(
            `https://www.zhipin.com/c101010100/?page=${page}&ka=page-${page}`
          )
          .set("headers", headers)
          .proxy(ip)
          .timeout(10000)
          .end(async (err, res) => {
            if (err) {
              console.error("error");
              return;
            } else if (res.statusCode === 200) {
              console.log(res.text);
              this.saveData(res.text);
            } else {
              console.log("ip访问出错！重新选择ip");
              this.subscribe();
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    return items;
  }
}

module.exports = updataCrawl;
