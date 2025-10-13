import Subscription from "./../models/subscription.model.js";
import { workflowClient } from './../config/upstash.js';
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, nxt) => {
  try {
    const {
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      startDate,
    } = req.body;

    const subscription = await Subscription.create({
      user: req.user._id,
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      startDate: startDate || new Date(),
    });

    
    const {workflowRunId} = await workflowClient.trigger({url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`, body:{subscriptionId: subscription._id}, headers:{'content-type': 'application/json'}, retries: 0});

    res.status(201).json({ success: true, data: {subscription, workflowRunId} });
  } catch (err) {
    nxt(err);
  }
};


export const getUserSubscriptions = async (req, res, nxt) => {
    try{
        if(req.user._id != req.params.id) return res.status(401).json({message: "It is not your account"});

        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});
    }catch(err) {
        nxt(err);
    }
};

export const getAllSubscriptions = async (req, res, nxt) => {
    try{
        const subscriptions = await Subscription.find();

        res.status(200).json({success: true, data: subscriptions});
    }catch(err) {
        nxt(err);
    }
};


export const getSingleSubscription = async (req, res, nxt) => {
    try{
        const subscription = await Subscription.findById(req.params.id);


        if(req.user._id != subscription.user) return res.status(401).json({message: "It is not your subscription."});
        res.status(200).json({success: true, data: subscription});
    }catch(err) {
        nxt(err);
    }
};

export const updateSubscription = async (req, res, nxt) => {
    try{
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription) return res.status(404).json({message: "Subscription not found."});
        if(req.user._id.toString() != subscription.user.toString()) return res.status(401).json({message: "It is not your subscription."});
        
        const updatedSubscription = {};

        if(req.body.name) updatedSubscription.name = req.body.name;
        if(req.body.price) updatedSubscription.price = req.body.price;
        if(req.body.currency) updatedSubscription.currency = req.body.currency;
        if(req.body.frequency) updatedSubscription.frequency = req.body.frequency;
        if(req.body.category) updatedSubscription.category = req.body.category;
        if(req.body.paymentMethod) updatedSubscription.paymentMethod = req.body.paymentMethod;
        if(req.body.renewalDate) updatedSubscription.renewalDate = req.body.renewalDate;
        
        
        await subscription.updateOne(updatedSubscription);

        res.status(200).json({success: true, data: {...subscription._doc, ...updatedSubscription}});
    }catch(err) {
        nxt(err);
    }
};


export const deleteSubscription = async (req, res, nxt) => {
    try{
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription) return res.status(404).json({message: "Subscription not found."});
        if(req.user._id.toString() != subscription.user.toString()) return res.status(401).json({message: "It is not your subscription."});

        await subscription.deleteOne();
        res.status(200).json({success: true, data: null});
    }catch(err) {
        nxt(err);
    }
};


export const cancelSubscription = async (req, res, nxt) => {
    try{
        const subscription = await Subscription.findById(req.params.id);

        if(!subscription) return res.status(404).json({message: "Subscription not found."});
        if(req.user._id.toString() != subscription.user.toString()) return res.status(401).json({message: "It is not your subscription."});

        await subscription.updateOne({status: 'cancelled'});
        res.status(200).json({success: true, data: {...subscription._doc, status: 'cancelled'}});
    }catch(err) {
        nxt(err);
    }
};

export const getUpcomingSubscriptions = async (req, res, nxt) => {
      console.log('Reached getUpcomingSubscriptions route');

    try{
        const subscriptions = await Subscription.find({renewalDate: {$gt: new Date()}, user: req.user._id, status: 'active'});
        
        res.status(200).json({success: true, data: subscriptions});
    }catch(err) {
        nxt(err);
    }
};