import app from "./app.js";
import { connectDB } from "./config/database.js";

connectDB();

const port = 4000;

app.listen(port || process.env.PORT, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});
