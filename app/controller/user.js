const { Controller } = require("egg");

class UserController extends Controller {
  async createUser(username, password) {
    this.ctx.body = {
      code: 0,
      data: {
        user: {
          id: "",
          username: ""
        }
      }
    };
  }

  async loginWithUnPw(username, password) {}

  async logout(username, password) {}
}

module.exports = UserController;
