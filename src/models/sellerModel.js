import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    businessName: {
        type:String,
        required:true
    },
    mobile: {
        type:String,
        required:true,
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    
})