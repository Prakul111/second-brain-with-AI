import express from 'express';
import { UserModel, ContentModel, LinkModel } from './db.ts';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userMiddleware } from './middleware.ts';
import { random } from './utils.ts';
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

const mongoUrl = process.env.MONGODB_URL as string;
const jwtToken = process.env.JWT_PASSWORD as string;

app.post('/api/v1/signup', async (req, res) => {
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

app.post('/api/v1/signin', async (req, res) => {
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
  const content = await ContentModel
    .find({
      userId: userId,
    })
    .populate('userId', 'username');
  res.json({
    content,
  });
});

app.delete('/api/v1/content', userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;
  // @ts-ignore
  const userId = req.userId;

  await ContentModel.deleteOne({
    contentId,
    userId: userId,
  });

  res.json({
    message: 'course deleted',
  });
});

// app.post('/api/v1/brain/share', userMiddleware, async (req, res) => {
//   const { share } = req.body;
//   if (share) {
//     const existingLink = await LinkModel.findOne({
//       // @ts-ignore
//       userId: req.userId
//     })
//     if (existingLink) {

//       res.json({
//         hash: existingLink.hash
//       })

//       return
//     }
//     const hash = random(10)
//     await LinkModel.create({
//       // @ts-ignore
//       userId: req.userId,
//       hash: hash
//     })

//     res.json({
//       message: "/share/" + hash
//     })
//   } else await LinkModel.deleteOne({
//     // @ts-ignore
//     userId: req.userId
//   })

//   res.json({
//     message: 'remove link',
//   });
// });

// app.get('/api/v1/brain/:sharelink', async (req, res) => {
//   const hash = req.params.sharelink

//   const link = await LinkModel.findOne({
//     hash,
//   })

//   if (!link) {
//     res.status(411).json({
//       message: "Incorrect Input"
//     })
//     return
//   }

//   const content = await ContentModel.find({
//     userId: link.userId
//   })

//   const user = await UserModel.findOne({
//     _id: link.userId.toString()
//   })
//   if (!user) {
//     res.status(411).json({
//       message: "user not found error"
//     })
//     return
//   }

//   res.json({
//     username: user.username,
//     content: content
//   });
// });

async function main() {
  await mongoose.connect(mongoUrl);
  console.log('connected to mongo');
  app.listen(3000);
}

main();
