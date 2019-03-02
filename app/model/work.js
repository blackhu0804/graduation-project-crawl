module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  const WorkSchema = new Schema({
    id: ObjectId,
    jobTitle: String,
    companyName: String,
    salary: String,
    href: String,
    workLocation: String,
    workYear: String,
    academic: String,
    companyCategory: String,
    finance: String,
    peopleCount: String
  });
  let Work = mongoose.model("Work", WorkSchema);
  return Work;
};
