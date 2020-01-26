import express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import ChatController from '../controllers/chat.controller';

const { checkUserLoggedIn } = authMiddleware;


const router = express.Router();

router.post('/', checkUserLoggedIn, ChatController.saveMessage);
router.get('/', checkUserLoggedIn, ChatController.getMessages);
router.get('/users', checkUserLoggedIn, ChatController.getAllUsers);

export default router;
