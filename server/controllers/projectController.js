const Project=require("../models/Project");



// CREATE

exports.createProject=async(req,res)=>{

try{


const project=
await Project.create({

userId:req.user._id,

...req.body

});


res.status(201)
.json(project);



}
catch(error){

res.status(500)
.json({
message:error.message
});


}


};




// GET ALL USER PROJECTS

exports.getProjects=async(req,res)=>{


try{


const projects=
await Project.find({

userId:req.user._id

});


res.json(projects);


}
catch(error){

res.status(500)
.json({
message:error.message
});

}


};




// DELETE

exports.deleteProject=
async(req,res)=>{


try{


await Project.findByIdAndDelete(
req.params.id
);


res.json({

message:"Project deleted"

});


}
catch(error){

res.status(500)
.json({
message:error.message
});


}


};