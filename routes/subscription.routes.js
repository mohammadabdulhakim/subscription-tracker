import {Router} from 'express';

const subscriptionRouter = Router();


subscriptionRouter.get('/', (req,res)=>{
    res.send({title: 'get all subscription'})
})
subscriptionRouter.get('/:id', (req,res)=>{
    res.send({title: 'get subscription details'})
})
subscriptionRouter.post('/', (req,res)=>{
    res.send({title: 'write a subscription'})
})
subscriptionRouter.put('/:id', (req,res)=>{
    res.send({title: 'update a subscription'})
})
subscriptionRouter.delete('/:id', (req,res)=>{
    res.send({title: 'delete a subscription'})
})
subscriptionRouter.get('/user/:id', (req,res)=>{
    res.send({title: 'get all user\'s subscriptions'})
})
subscriptionRouter.put('/:id/cancel', (req,res)=>{
    res.send({title: 'Cancel subscriptions'})
})
subscriptionRouter.put('/upcoming-renewals', (req,res)=>{
    res.send({title: 'GET upcoming renewals'})
})


export default subscriptionRouter;