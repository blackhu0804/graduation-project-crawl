const { Service } = require("egg");
const cheerio = require("cheerio");
const request = require("superagent");
const SuperagentProxy = require("superagent-proxy");

class crawlService extends Service {
  async fetch() {
    const { ctx } = this;
    let items = [];

    for (let page = 1; page <= 1; page++) {
      this.ctx.logger.debug(`正在爬取boss第${page}页职位信息`);
      let { data } = await ctx.curl(
        `https://www.zhipin.com/c101010100/?page=${page}&ka=page-${page}`
      );
      data = data.toString();
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
    return items;
  }
}

module.exports = crawlService;
