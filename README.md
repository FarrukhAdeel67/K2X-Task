# Twitter-like Social Media Platform

This is a simple Twitter-like social media platform built using Node.js, Express, MongoDB, and Mongoose. It allows users to post tweets, follow other users, like tweets, and view user profiles.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js: Ensure that you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

- MongoDB: You will need a MongoDB database. You can install it locally or use a cloud-based MongoDB service like MongoDB Atlas.

### Installing

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/FarrukhAdeel67/K2X-Task.git
   
Navigate to the project directory:
  
``` cd twitter-clone```

Install the project dependencies:
```npm install```

Open the ex.config.env file. and rename it with config.env
Add the following environment variables with their values:
```
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```
Start the Node.js server:
``` npm run dev ```

Access the application in your web browser or using an API testing tool like Postman.

API Endpoints <br />
/api/register: Register a new user.<br />
/api/login: Log in as a user. <br />
/api/me/:id/user/:userId/follow : follow user. <br />
/api/me/:id : get user's profile <br />
/api/me/:id/user/:userId : get another user's profile <br />
/api/tweets/: Get a list of all tweets. <br />
/api/me/tweets/newTweet: Post a new tweet. <br />
/api/me/profile: Get the authenticated user's profile. <br />
/api/me/:userId/tweets: Get all following users tweets <br />
/api/me/:id/tweets/:tweetId/ : Get single tweet details <br />
/api/me/:userId/follow: Follow a user by their ID.<br />
/api/me/tweets/:tweetId/like: Like a tweet by its ID. <br />
/api/me/:id/tweets/:tweetId/removeTweet : Delete the tweet <br />


Folder Structure <br />
controllers/: Contains route handlers and controller logic. <br /> 
models/: Defines Mongoose models for User and Tweet. <br />
routes/: Defines API routes. <br />
middlewares/: Custom middleware functions. <br />
utils/: Utility functions and error handling. <br />



<a href="https://github.com/FarrukhAdeel67">
<img src="https://avatars.githubusercontent.com/u/56479423?v=4" width="100px;" alt="" style="border-radius:50%"/>
<br />
<sub><b>Farrukh Adeel</b></sub>
</a>
