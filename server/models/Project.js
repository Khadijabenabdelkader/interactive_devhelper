const mongoose=require("mongoose");


const projectSchema=new mongoose.Schema({


userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},


title:{
    type:String,
    required:true
},


description:{
    type:String,
    required:true
},


technologies:[String],


github:{
    type:String,
    default:""
},


demo:{
    type:String,
    default:""
},


image:{
    type:String,
    default:""
},


category:{
    type:String,
    default:"Web Development"
}



},{
timestamps:true
});



module.exports=
mongoose.model(
"Project",
projectSchema
);