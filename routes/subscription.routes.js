import {Router} from 'express';
import authorize from './../middlewares/auth.middleware.js';
import { cancelSubscription, createSubscription, deleteSubscription, getAllSubscriptions, getSingleSubscription, getUpcomingSubscriptions, getUserSubscriptions, updateSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();


subscriptionRouter.get('/upcoming', authorize, getUpcomingSubscriptions); //! Always keep static routes before dynamic ones

subscriptionRouter.get('/', getAllSubscriptions)
subscriptionRouter.post('/', authorize, createSubscription)
subscriptionRouter.get('/:id', authorize, getSingleSubscription)
subscriptionRouter.put('/:id', authorize, updateSubscription)
subscriptionRouter.delete('/:id', authorize, deleteSubscription)

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription)



export default subscriptionRouter;