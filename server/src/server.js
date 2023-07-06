require("dotenv").config();

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const { mongoConnect } = require("./services/mongo");

const User = require("./models/user.mongo");

async function startServer() {
  await mongoConnect();
  //await User.deleteMany();
  server.listen(process.env.PORT, () => {
    console.log("Running server");
  });
}

startServer();
/*
-create router for 
  - if he want to login and he sign in using google then tell him to reset his passwornd by forgot and reset password 
    using send email and after that make the flag as false

    // if we want to update his password and used google then here i should ask him about his current password
    but he does not know it so tell him to clcik of forgot password 

   // apply if he tries to logi in using email and passwprd wrong for 3 times 

*/
