import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price:{
        type: Number,
        required: [true, "Subscription price is required."],
        min: [0.001, "Price must be greater than $0"],
        max: [1000000, "Price must be less than $1000000"],
    },
    currency: {
        type: String,
        required: true,
        enum: ['EGP', 'USD', 'EUR'],
        default: 'EGP',
    },
    frequency:{
        type:String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category:{
        type:String,
        enum: ['sports', 'news', 'technology', 'finance', 'study'],
        required,
    },
    paymentMethod:{
        type: String,
        required,
        trim,
        maxLength: 1024,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required,
        validate:{
            validator: (value) => value <= new Date(),
            message: "Start Date Can not be a date in the future.",
        }
    },
    renewalDate: {
        type: Date,
        validate:{
            validator: function (value) {return value > this.startDate},
            message: "Renewal Date must be after start date.",
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required,
        index: true,
    }
}, {timestamps: true});


subscriptionSchema.pre('save', function (nxt){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);

        if(this.renewalDate < new Date()){
            this.status = 'expired';
        }

        nxt();
    }
})

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;