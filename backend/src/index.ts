import express from 'express';
import { UserModel, ContentModel } from './db.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { userMiddleware } from './middleware.js';

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGODB_URL as string;
const jwtToken = process.env.JWT_PASSWORD as string;

app.post('/api/v1/user/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // hasing the password

  // use input validation / zod

  try {
    const hashedPassword = await bcrypt.hash(password, 5);

    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json({
      message: 'you are signed up',
    });
  } catch (e: any) {
    console.error(e);

    res.status(400).json({
      message: e.message,
    });
  }
});

app.post('/api/v1/user/signin', async (req, res) => {
  const { email, password } = req.body;

  const userRequired: any = await UserModel.findOne({
    email,
  });

  if (!userRequired) {
    res.json({
      message: "User dosen't exists",
    });
  }

  const userExist = await bcrypt.compare(password, userRequired.password);

  if (userExist) {
    const token = jwt.sign(
      {
        id: userRequired._id,
      },
      jwtToken,
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: 'Incorrect Credentials',
    });
  }

  // try {
  //   await UserModel.create({
  //     email,
  //     password,
  //   });
  //   res.json({
  //     message: 'you are signed up',
  //   });
  // } catch (e: any) {
  //   console.error(e);

  //   res.status(400).json({
  //     message: e.message,
  //   });
  // }
});

app.post('/api/v1/content', userMiddleware, async (req, res) => {
  const { link, title } = req.body;

  await ContentModel.create({
    link,
    title,
    // @ts-ignore
    userId: req.userId,
    tags: [],
  });

  return res.json({
    message: 'Content added',
  });
});

app.get('/api/v1/content', userMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const content = ContentModel.find({
    userId: userId,
  }).populate('userId', 'username');
  res.json({
    content,
  });
});

app.delete('/api/v1/content', userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteOne({
    contentId,
    // @ts-ignore
    userId: userId,
  });

  res.json({
    message: 'course deleted',
  });
});

app.post('/api/v1/brain/share', (req, res) => {
  res.json({
    message: 'add a course',
  });
});

app.get('/api/v1/brain/:shareLink', (req, res) => {
  res.json({
    message: 'add a course',
  });
});

async function main() {
  await mongoose.connect(mongoUrl);
  console.log('connected to mongo');
  app.listen(3000);
}

main();
