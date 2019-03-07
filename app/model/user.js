module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
  const UserSchema = new Schema(
    {
      id: ObjectId,
      username: String,
      password: String,
      email: String,
      salt: String, // 密码加密使用的盐,
      createTime: {
        type: Date,
        default: Date.now
      },
      updateTime: {
        type: Date,
        default: Date.now
      }
    },
    {
      versionKey: false,
      timestamps: { createdAt: "createTime", updatedAt: "updateTime" }
    }
  );

  return mongoose.model("User", UserSchema);
};
