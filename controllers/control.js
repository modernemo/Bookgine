import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к файлу db.json
const dbPath = path.join(__dirname, "../db.json");

// Чтение данных из db.json
function readDB() {
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
}

// Запись данных в db.json
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

// Функция для входа
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const db = readDB(); // Читаем данные из db.json

        // Поиск пользователя по email
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ success: false, message: "Неверный email или пароль" });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Неверный email или пароль" });
        }

        // Создание токена
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token)
        res.cookie('accessToken', token, {maxAge: 1000*60*60*24*7, httponly: true})
        res.redirect("/")
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
}

// Функция для регистрации
async function register(req, res) {
    try {
        const { email, password } = req.body;
        const db = readDB(); // Читаем данные из db.json

        // Проверка на существующего пользователя
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email уже используется" });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = {
            id: db.users.length + 1, // Генерация ID
            email,
            password: hashedPassword
        };

        db.users.push(newUser); // Добавление пользователя в массив
        writeDB(db); // Запись обновлённых данных в db.json

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
}

export { getlog, getreg, getboard, logout, login, register, readDB, writeDB };
