import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "../db.json");

function readDB() {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const getlog = (req, res) => {
    res.render("login");
};

const getreg = (req, res) => {
    res.render("register");
};

const getboard = (req, res) => {
    res.render("index");
};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.redirect("login");
};

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const db = readDB(); 

        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ success: false, message: "Неверный email или пароль" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Неверный email или пароль" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token)
        res.cookie('accessToken', token, {maxAge: 1000*60*60*24*7, httponly: true})
        res.redirect("/")
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
}

async function register(req, res) {
    try {
        const { email, password } = req.body;
        const db = readDB(); 

        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email уже используется" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: db.users.length + 1,
            email,
            password: hashedPassword
        };

        db.users.push(newUser); 
        writeDB(db); 

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
}

export { getlog, getreg, getboard, logout, login, register, readDB, writeDB };
