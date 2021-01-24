import dotenv from 'dotenv';

dotenv.config();

export const config = {
  accessToken: process.env.ACCESS_TOKEN,
};
