var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware"),
    Comment     = require("../models/comment");


//Comments, new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//Comments create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment) {
               if(err) {
                   req.flash("error", "Something went wrong");
                   console.log(err);
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "Successfully added comment");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   });
});

//Comments edit
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
           if(err) {
               res.redirect("back");
            } else {
                res.render("./comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//Comments update
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if(err) {
           console.log(err);
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });

});

//Comments destroy
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;