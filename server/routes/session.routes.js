import express from 'express';
import { handleLogin, handleGetLoggedUser, handleLogout} from '../controllers/session.controller.js';
import { authenticate } from "../config/middleware.config.js";

const router = express.Router();

router.route('/')
    .post(handleLogin)
    .get(authenticate, handleGetLoggedUser)
    .delete(authenticate, handleLogout);

export default router;