module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const CitySchema = new Schema({
    id: ObjectId,
    code: String,
    name: String
  });
  return mongoose.model("City", CitySchema);
};
