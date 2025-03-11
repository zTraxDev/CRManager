import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000 as number,
    mongodbUri: process.env.MONGODB_URI as string,
    session_secret: process.env.SECRET_SESSION as string,
    sentry_cdn: process.env.SENCTRY_CDN as string
};