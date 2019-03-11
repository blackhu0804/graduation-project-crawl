const { Controller } = require("egg");

class UserController extends Controller {
  /**
   * url: '/user'
   * method: POST
   * body : {
   *  username: '',
   *  password: '',
   *  email: '',
   *  code: ''
   * }
   */
  async createUser() {
    const { username, password, email, code } = this.ctx.request.body;
    const verifyCode = await this.app.redis.get(
      `egg_crawl_verify_code${email}`
    );
    if (code === verifyCode) {
      const createdUser = await this.ctx.service.user.createUserWithUnPw(
        username,
        password,
        email
      );
      this.ctx.body = {
        code: 0,
        msg: "注册成功"
        // data: {
        //   msg: "注册成功",
        //   user: createdUser
        // }
      };
    } else {
      this.ctx.body = {
        code: -1,
        msg: "验证码不正确"
      };
    }
  }

  /**
   * url: '/login'
   * method: POST
   * body : {
   *  username: '',
   *  password: '',
   * }
   */
  async loginWithUnPw() {
    const { username, password } = this.ctx.request.body;
    const foundUser = await this.ctx.service.user.loginWithUnPw(
      username,
      password
    );
    if (foundUser) {
      this.ctx.session.user = foundUser;
      console.log(this.ctx.session.user);
      this.ctx.body = {
        code: 0,
        data: {
          msg: "登录成功",
          attemps: this.ctx.session.user,
          user: {
            username: foundUser.username
          }
        }
      };
    }
  }

  /**
   * 判断用户是否登录
   * url: '/'
   * method: GET
   */
  async index() {
    console.log(this.ctx.session.user);
    this.ctx.body = {
      code: 0,
      data: {
        hasLogin: !!this.ctx.session.user
      }
    };
  }

  /**
   * url: 'logout'
   * method: POST
   */
  async logout() {
    if (this.ctx.session.user) {
      this.ctx.session.user = null;
    }
    this.ctx.body = {
      code: 0,
      data: {
        msg: "退出成功"
      }
    };
  }

  /**
   * 找回密码
   * method: 'POST'
   * url: '/retrieve'
   * body: {
   *  email: '',
   *  code: "",
   *  password: ""
   * }
   */
  async retrieve() {
    const { email, code, password } = this.ctx.request.body;
    const verifyCode = await this.app.redis.get(
      `egg_crawl_verify_code${email}`
    );
    if (code === verifyCode) {
      const result = await this.ctx.service.user.retrievePw(email, password);
      if (result) {
        this.ctx.body = {
          code: 0,
          msg: "修改密码成功，请重新登录！~"
        };
      }
    }
  }

  /**
   * 校验验证码
   */
  async checkCode() {
    const { email, code } = this.ctx.request.body;
    const verifyCode = await this.app.redis.get(
      `egg_crawl_verify_code${email}`
    );
    if (code === verifyCode) {
      this.ctx.body = {
        code: 0,
        msg: "验证验证码成功"
      };
    } else {
      this.ctx.body = {
        code: -1,
        msg: "验证码错误"
      };
    }
  }

  /**
   * 发送邮箱验证码
   * url: '/sendVerifyCode'
   * method: POST
   * body: {
   *  email: '',
   *  type: 0 注册 1 找回密码
   * }
   */
  async sendVerifyCode() {
    const { email, type } = this.ctx.request.body;
    const verifyCode = Math.ceil(Math.random() * 1000000);

    const userIsInTable = await this.ctx.model.User.find({ email });
    if (type === 0 && userIsInTable.length > 0) {
      this.ctx.body = {
        code: -1,
        msg: "邮箱已注册"
      };
      return;
    } else if (type === 1 && userIsInTable.length === 0) {
      this.ctx.body = {
        code: -1,
        msg: "邮箱不存在"
      };
      return;
    }

    const emailOptions = {
      from: "812510003@qq.com",
      subject: "注册验证码",
      to: email,
      html: `【登录验证】您的验证码为${verifyCode},如不是您操作请忽略`
    };
    const codeCoolingDown = await this.app.redis.get(
      `egg_crawl_verify_code_cool_down${email}`
    );

    if (codeCoolingDown) {
      this.ctx.body = {
        code: -1,
        msg: "验证码发送频繁"
      };
      return;
    }
    this.app.redis.set(
      `egg_crawl_verify_code_cool_down${email}`,
      "anything",
      "PX",
      60 * 1000
    );

    //五分钟有效
    await this.app.redis.set(
      `egg_crawl_verify_code${email}`,
      verifyCode,
      "PX",
      5 * 60 * 1000
    );

    let result = await this.ctx.service.sendCode.send(emailOptions);
    if (!result) {
      this.ctx.body = {
        code: -1,
        msg: "验证码发送失败"
      };
    } else {
      this.ctx.body = {
        code: 0,
        msg: "验证码发送成功"
      };
    }
  }
}

module.exports = UserController;
