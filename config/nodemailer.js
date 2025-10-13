import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})