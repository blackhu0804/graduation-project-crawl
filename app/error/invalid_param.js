"use strict";

const BaseHttp = require("./base_http");

class InvalidParam extends BaseHttp {
  constructor(paramName, requirement, httpMsg, code) {
    const msg = `${paramName} does not meet requirement: ${requirement}`;
    super(msg, code, httpMsg || "输入有问题呀老铁", code);
  }

  static get ["CODE"]() {
    return code;
  }
}

module.exports = InvalidParam;
