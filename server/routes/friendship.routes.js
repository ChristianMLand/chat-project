import express from 'express';
import {
    requestFriendship,
    updateFriendship
} from '../controllers/friendship.controller.js';
import { authenticate } from "../config/middleware.config.js";

const router = express.Router();
router.route("/")
    .post(authenticate, requestFriendship)

router.route("/:id")
    .patch(authenticate, updateFriendship)

export default router;