const link = require("../models/link");

module.exports = function(Link){
    return {
        SetRouting: function(router){
            router.post('/uploadlink', this.uploadlink);
        },
        uploadlink: function(req, res){
            console.log("Hey");
            const newLink = new Link();
            newLink.title = req.body.title;
            newLink.link = req.body.link;
            newLink.save(function(err){
                if(err) console.log(err);
                console.log(req.body.title + " " + req.body.link)
                res.redirect('back');
            })
        }
    }
}