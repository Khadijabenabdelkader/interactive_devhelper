const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    username:{
        type:String,
        required:true
    },


    bio:{
        type:String,
        default:""
    },


    avatar:{
        type:String,
        default:""
    },


    skills:[{

        type:String

    }],


    github:{
        type:String,
        default:""
    },


    linkedin:{
        type:String,
        default:""
    }


},{
    timestamps:true
});


module.exports = mongoose.model(
    "Profile",
    profileSchema
);