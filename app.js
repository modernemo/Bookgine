import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import { getUserById } from "./services/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use((req, res, next) => {
    const publicPaths = ['/login', '/register'];

    if (publicPaths.includes(req.path)) {
        return next(); // skip auth check
    }

    const accessToken = req.cookies.accessToken;
    const secretKey = process.env.JWT_SECRET;
    console.log(accessToken);
    if (!accessToken) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(accessToken, secretKey);
        req.user = getUserById(decoded.id);
        if (!req.user) {
            return res.redirect('/login');
        }
        next();
    } catch (err) {
        return res.redirect('/login');
    }
});

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

import route from "./routes/route.js";
app.use("/", route);

app.listen(port, () => console.log(`Application is running on http:localhost:${port}`));

