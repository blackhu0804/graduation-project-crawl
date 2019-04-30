const { Service } = require("egg");
const cheerio = require("cheerio");
// const request = require("superagent");
// const SuperagentProxy = require("superagent-proxy");

class getWorkInfoService extends Service {
  async getWorkInfo(url) {
    const { ctx } = this
    let { data } = await ctx.curl(url)
    let $ = cheerio.load(data.toString());
    let jobInfo = $('.detail-content > .job-sec:first-child').html()
    return jobInfo.replace(/\n/g, '')
  }
}

module.exports = getWorkInfoService;