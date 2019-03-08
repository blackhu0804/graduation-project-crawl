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
        data: {
          user: createdUser
        }
      };
    } else {
      this.ctx.body = {
        code: 0,
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
    this.ctx.session.user = {
      id: foundUser.id
    };

    this.ctx.body = {
      code: 0,
      data: {
        attemps: this.ctx.session.user,
        user: {
          id: foundUser.id
        }
      }
    };
  }

  /**
   * 判断用户是否登录
   * url: '/'
   * method: GET
   */
  async index() {
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
   * 发送邮箱验证码
   * url: '/sendVerifyCode'
   * method: POST
   * body: {
   *  email: ''
   * }
   */
  async sendVerifyCode() {
    const { email } = this.ctx.request.body;
    const verifyCode = Math.ceil(Math.random() * 1000000);

    const userIsInTable = await this.ctx.model.User.find({ email });
    if (userIsInTable.length > 0) {
      this.ctx.body = {
        code: 0,
        msg: "邮箱已注册"
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
        msg: "发送失败"
      };
    } else {
      this.ctx.body = {
        code: 0,
        msg: "发送成功"
      };
    }
  }
}

module.exports = UserController;
