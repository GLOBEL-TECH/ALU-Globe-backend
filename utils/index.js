 

import jwt from 'jsonwebtoken';

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_DATE,
  });

export const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user.id);

  // const cookieOptions = {
  //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRY * TWENTY_FOUR_HOURS),
  //   httpOnly: true,
  // };

  // res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
