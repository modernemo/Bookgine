import {Router} from 'express'
import {
    getlog,
    getreg,
    getboard,
    logout,
    login,
    register,
} from "../controllers/control.js";

const router = Router();

router.get("/login", getlog);
router.get("/register", getreg);
router.get("/dashboard", getboard);
router.get("/logout", logout);

router.post("/register", register);
router.post("/login", login);

export default router;