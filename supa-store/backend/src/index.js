// let's go!

// startup our node server
require('dotenv').config({ path: 'variables.env' });
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const jwt = require('jsonwebtoken');
const db = require('./db');

const server = createServer();

// TODO use express middleware to handle cookies(JWT);
server.express.use(cookieParser());
// TODO use express middleware to populate current user
server.express.use((req, res, next) => {
  // get the token from teh cookie
  const { token } = req.cookies;
  if(token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId;
  }
  next()
})


server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  details => {
    console.log(
      `server is now running on port: http:/localhost:${details.port}`
    );
  }
);
