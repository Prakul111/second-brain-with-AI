import mongoose, { Schema } from 'mongoose';


// const adminSchema = new Schema({
//   username: { type: String, unique: true },
//   password: String,
//   email: String,
// });

const userSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  email: String,
});

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  type: String,
  userId: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
});

const linkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

const UserModel = mongoose.model('User', userSchema);
const ContentModel = mongoose.model('Content', contentSchema);
const LinkModel = mongoose.model('Link', linkSchema);
// const AdminModel = mongoose.model('admin', adminSchema);

export { UserModel, ContentModel, LinkModel };
