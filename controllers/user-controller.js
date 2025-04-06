import prisma from '../prisma-client.js';
import catchAsync from '../utils/catch-async.js';
import AppError from '../utils/appError.js';
import { createSendToken } from '../utils/index.js';
import { google } from 'googleapis';
const CALLBACK_URL = 'http://localhost:8000';

const initGoogle = () =>
  // Authentication using OAuth 2.0
  new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: CALLBACK_URL,
  });

export const authWithGoogle = catchAsync(async (req, res, next) => {
  const { access_token } = req.body;

  try {
    const auth = initGoogle();

    if (!access_token) {
      return next(new AppError('Please provide a valid access token', 400));
    }

    auth.setCredentials({
      access_token: access_token,
    });

    const people = google.people({ version: 'v1', auth });

    const { data } = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    });

    const name = data?.names[0].displayName;
    const email = data?.emailAddresses[0].value;
    const picture = data?.photos[0].url;

    if (!email.endsWith('@alustudent.com')) {
      return next(new AppError('Please provide a valid ALU email', 403));
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          profilePicture: picture,
        },
      });
    }

    createSendToken(user, 200, res);
  } catch {
    return next(new AppError('Invalid access token', 401));
  }
});

export const getUser = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
