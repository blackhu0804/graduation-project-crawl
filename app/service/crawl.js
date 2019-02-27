const { Service } = require("egg");
const cheerio = require("cheerio");
const iconvLite = require("iconv-lite");

class crawlService extends Service {
  async fetch() {
    const { ctx } = this;
    let page = 1;
    let { data } = await ctx.curl(
      `https://www.zhipin.com/c101010100/?page=${page}&ka=page-${page}`
    );
    data = data.toString();
    let $ = cheerio.load(data);
    let jobItem = $(".job-primary");
    let items = [];
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
        workLocation,
        workYear,
        academic,
        companyCategory,
        finance,
        peopleCount
      });
    });
    return items;
  }
}

module.exports = crawlService;
