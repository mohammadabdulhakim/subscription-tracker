import {Router} from 'express';

const userRouter = Router();

userRouter.get('/',(req,res)=>{
    res.send({title: "All users"})
});
userRouter.get('/:id',(req,res)=>{
    res.send({title: "GET user " + req.params.id})
});
userRouter.post('/',(req,res)=>{
    res.send({title: "Write new user"})
});
userRouter.put('/:id',(req,res)=>{
    res.send({title: "Update user"})
});
userRouter.delete('/:id',(req,res)=>{
    res.send({title: "delete a user data"})
});


export default userRouter;