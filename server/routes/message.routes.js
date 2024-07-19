import express from 'express';
import {
    handleGetMessages,
    handleCreateMessage,
    handleUpdateMessage,
    handleDeleteMessage
} from '../controllers/message.controller.js';
import { authenticate } from "../config/middleware.config.js";

const router = express.Router();
router.route("/")
    .get(authenticate, handleGetMessages)
    .post(authenticate, handleCreateMessage)

router.route("/:id")
    .put(authenticate, handleUpdateMessage)
    .patch(authenticate, handleDeleteMessage);

export default router;