const { Service } = require("egg");
const crypto = require("crypto");
const { pbkdf2, randomBytes } = crypto;
const { promisify } = require("util");

const pbkdf2P = promisify(pbkdf2);
const randomBytesP = promisify(randomBytes);

async function genEncryptedPassword(rawPassword) {
  const salt = await randomBytesP(32);
  const encrypted = await pbkdf2P(rawPassword, salt, 10000, 128, "sha512");
  return {
    encrypted: encrypted.toString("base64"),
    salt: salt.toString("base64")
  };
}

class User extends Service {
  async createUserWithUnPw(username, password) {
    const { salt, encrypted } = await genEncryptedPassword(password);
    const created = await this.ctx.model.User.create({
      username,
      password: encrypted,
      salt
    });
    delete created.password;
    delete created.salt;
    return created;
  }
}

module.exports = User;
