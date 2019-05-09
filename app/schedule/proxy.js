const Subscription = require("egg").Subscription;
const request = require("superagent");
const SuperagentProxy = require("superagent-proxy");
const cheerio = require("cheerio");
SuperagentProxy(request);

/**
 * 爬取代理
 */
class proxyCrawl extends Subscription {
  static get schedule() {
    return {
      immediate: true,
      // interval: "10s",
      // cron: "0 0 */24 * * *", // 12小时爬一次
      // cron: "0 0 0 1 12 1",
      type: "all" // 指定所有的 worker 都需要执行
    };
  }

  /**
   * 初始化表
   */
  async initTable() {
    let proxy_rows = await this.ctx.model.Proxy.find({});
    await proxy_rows.forEach(item => {
      this.checkIP(item.proxy);
    });
  }

  /**
   * 检测ip是否有效
   * 有效存入 Proxy 表
   */
  async checkIP(ip, target) {
    let url = target || "https://www.baidu.com";
    return await request
      .get(url)
      .set(
        "headers",
        `"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"`
      )
      .proxy(ip)
      .timeout(5000)
      .end(async (err, res) => {
        if (!err && res.statusCode === 200) {
          console.log(`此IP:${ip}可成功访问`);
          let doc = await this.ctx.model.Proxy.find({ proxy: ip });
          if (doc.length === 0) {
            console.log("存入数据成功");
            await this.ctx.model.Proxy.create({ proxy: ip });
          } else {
            console.log(`数据库中已存在此IP:${ip}`);
          }
        } else {
          console.log(`此IP:${ip}暂时不能访问`);
          let noVisit = await this.ctx.model.Proxy.findOneAndDelete({
            proxy: ip
          });
          if (noVisit) {
            console.log(`删除数据库中无法正常访问的ip：${ip}`);
          }
        }
      });
  }

  /**
   * 抓取代理ip数据
   * 存入数据库
   */
  async subscribe() {
    let headers = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.6",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
    };
    console.log("正在爬取代理...");
    await this.initTable();
    await request.get(`https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list`)
      .set('headers', headers).timeout(5000).end((err, res) => {
        if(err) {
          console.log('错误')
        } else {
          let str = res.text
          let regex = /\{(.+)\}/g
          let arr = []
          str.match(regex).map(async (item, index) => {
            let data = JSON.parse(item)
            if(data.country === 'CN') {
              let ip = `${data.type}://${data.host}:${data.port}`
              await this.checkIP(ip, "https://www.zhipin.com/c101010100");
            }
          })
        }
      })
  }
  // async subscribe() {
  //   console.log("爬爬爬爬爬啊啪啪啪~~~");
  //   let isNoData = await this.initTable();
  //   // if (isNoData) {
  //   for (let page = 1; page <= 3; page++) {
  //     setTimeout(async () => {
  //       console.log(`当前正在爬取第${page}页`);
  //       let { data } = await this.ctx.curl(
  //         `http://ip.kxdaili.com/dailiip/2/${page}.html#ip`
  //       );
  //       data = data.toString();
  //       let $ = cheerio.load(data);
  //       let proxyText = $("tbody tr");
  //       let _this = this;
  //       proxyText.each(async function(index, item) {
  //         let $this = $(item);
  //         let proxy = $this
  //           .find("td")
  //           .first()
  //           .text();
  //         let port = $this.find("td:nth-child(2)").text();
  //         // let protocol = $this
  //         //   .find("td:nth-child(4)")
  //         //   .text()
  //         //   .toLowerCase();
  //         // 判断ip是否可以正常访问
  //         let ip = `http://${proxy}:${port}`;
  //         await _this.checkIP(ip, "https://www.zhipin.com/c101010100");
  //       });
  //     }, page * 3000);
  //   }
  //   // }
  // }
}

module.exports = proxyCrawl;
