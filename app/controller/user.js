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
    this.ctx.body = {
      code: 0,
      data: {
        user: {
          id: foundUser.id
        }
      }
    };
  }

  async logout(username, password) {}
}

module.exports = UserController;
