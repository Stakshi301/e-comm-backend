import {Schema,model} from 'mongoose';
import mongoose from 'mongoose';

const productSchema=new Schema({
    name:{type:String,requierd:true},
    description:{type:String,required:true},
    image:{type:String, required:true},
    price:{type:Number, required:true},
})

const productModel=model('productModel',productSchema);

export default productModel;