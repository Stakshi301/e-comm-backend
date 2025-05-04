import mongoose from'mongoose';
import {Schema,model} from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String },
  githubId: { type: String },
  password: {type: String, required:function(){
    return !this.githubId && !this.googleId;
  }},
  wishList:[{type:Schema.Types.ObjectId, ref:"productModel"}],
  cart:[{type:Schema.Types.ObjectId, ref:"productModel"}],
});

const Usermodel = model('User', userSchema);

export default Usermodel;
