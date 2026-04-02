import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
});

// const adminSchema = new Schema({
//   username: { type: String, unique: true },
//   password: String,
//   email: String,
// });

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
});

const UserModel = mongoose.model('user', userSchema);
// const AdminModel = mongoose.model('admin', adminSchema);
const ContentModel = mongoose.model('course', contentSchema);

export { UserModel, ContentModel };
