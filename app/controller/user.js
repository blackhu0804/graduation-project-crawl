const { Controller } = require("egg");

class UserController extends Controller {
  async createUser() {
    const { username, password } = this.ctx.request.body;
    const createdUser = await this.ctx.service.user.createUserWithUnPw(
      username,
      password
    );
    this.ctx.body = {
      code: 0,
      data: {
        user: createdUser
      }
    };
  }

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

  async index() {
    this.ctx.body = {
      code: 0,
      data: {
        hasLogin: !!this.ctx.session.user
      }
    };
  }

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
}

module.exports = UserController;
