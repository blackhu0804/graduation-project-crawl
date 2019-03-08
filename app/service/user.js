const { Service } = require("egg");
const crypto = require("crypto");
const { pbkdf2, randomBytes } = crypto;
const { promisify } = require("util");

const pbkdf2P = promisify(pbkdf2);
const randomBytesP = promisify(randomBytes);

async function genEncryptedPassword(rawPassword, salt) {
  if (!salt) {
    salt = await randomBytesP(32);
  }
  const encrypted = await pbkdf2P(
    rawPassword,
    salt.toString("base64"),
    10000,
    128,
    "sha512"
  );
  return {
    encrypted: encrypted.toString("base64"),
    salt: salt.toString("base64")
  };
}

class User extends Service {
  async createUserWithUnPw(username, password, email) {
    const { salt, encrypted } = await genEncryptedPassword(password);
    const created = await this.ctx.model.User.create({
      username,
      password: encrypted,
      email,
      salt
    });
    delete created.password;
    delete created.salt;
    return created;
  }

  async loginWithUnPw(username, password) {
    const found = await this.ctx.model.User.findOne({ username });
    if (!found) {
      throw new this.ctx.app.error.InvalidParam(
        "username",
        "no such username",
        "账户不存在"
      );
    }

    const foundPassword = found.password;

    const { encrypted: reEncryptedPassword } = await genEncryptedPassword(
      password,
      found.salt
    );
    if (foundPassword !== reEncryptedPassword) {
      throw new this.ctx.app.error.InvalidParam(
        "passsword",
        "username or password do not match",
        "用户名或密码不正确"
      );
    }
    return {
      id: found._id
    };
  }
}

module.exports = User;
