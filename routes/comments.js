//comments.js file

var express     = require("express")
var router      = express.Router({mergeParams : true})        //here express router is including in our code that will help us in doing associations , and mergeParams merging the parameters of campgrounds and comments together so that we dont get error when we shorten the routes during defining
var Campground  = require("../models/campground")
var Comment     = require("../models/comment")
var middleware= require("../middleware")

//======================================================
// COMMENTS ROUTES
//======================================================

//comments new 
router.get("/new",middleware.isLoggedIn ,function(req, res) {                  //here the whole route is /campgrounds/:id/comments/new , but we have shorten them using code on line 59 in app.js file
   //find campground by id
   Campground.findById(req.params.id , function(err,campground){
       if(err){
           console.log(err)
       } else{
           res.render("comments/new",{campground:campground})
       }
   })
})



//comments create
router.post("/", middleware.isLoggedIn , function(req,res){                          //here the whole route is /campgrounds/:id/comments , but we have shorten them using code on line 59 in app.js file
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        } else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash("error","Something went wrong") 
                    console.log(err)
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                   
                    //save comments
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success","Successfully added comment") 
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
        }
    })
})
//create new comment
//connect new comment to campground
//redirect campground show page


//Comments Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){         //here whole route is /campgrounds/:id/comments/:comment_id/edit, it is a nested route 
    Campground.findById(req.params.id, function(err, foundCampground){
          if(err || !foundCampground){                                               //error handling for, when some alters by going to edit comments the he changes the id of campground
            req.flash("error","No Campground found") 
            return res.redirect("back")
          }
    })
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back")
        } else{
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment})
        }
    })
})



//COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){              // in this line first argument is the that we are finding, second arg is the data that we have to update in the found id, third is callack
        if(err){
         res.redirect("back")
        } else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})
     
     
//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    //findByIdAndRemove
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err) {
           res.redirect("back")
       } else{
           req.flash("success","Comment deleted")
           res.redirect("/campgrounds/" + req.params.id)
       }
   })
})












module.exports = router
































