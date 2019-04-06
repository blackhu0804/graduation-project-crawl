module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const ProxySchema = new Schema({
    id: ObjectId,
    proxy: { type: String, unique: true }
  });
  return mongoose.model("Proxy", ProxySchema);
};
