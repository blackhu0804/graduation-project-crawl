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

  async loginWithUnPw(username, password) {}

  async logout(username, password) {}
}

module.exports = UserController;
