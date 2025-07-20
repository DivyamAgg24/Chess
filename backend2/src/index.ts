import { authRoute } from "./router/auth";
import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(
    cors({
      origin: "http://localhost:5173",
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    }),
  );

app.use('/auth', authRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});