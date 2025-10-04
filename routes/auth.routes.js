import {Router} from 'express';
import { signIn, signOut, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();


authRouter.post('/sign-up', signUp)

authRouter.post('/login', signIn)

authRouter.post('/sign-out', signOut)


export default authRouter;