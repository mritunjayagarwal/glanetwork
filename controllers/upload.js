const link = require("../models/link");

module.exports = function(Link){
    return {
        SetRouting: function(router){
            router.post('/uploadlink', this.uploadlink);
            router.get('/visit/:id', this.visit);
        },
        uploadlink: function(req, res){
            const newLink = new Link();
            newLink.title = req.body.title;
            newLink.link = req.body.link;
            newLink.save(function(err){
                if(err) console.log(err);
                console.log(req.body.title + " " + req.body.link)
                res.redirect('back'); 
            })
        },
        visit: function(req, res){
            Link.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    visits: +1
                }
            }, (err) => {
                if(err) console.log(err);
            });

            Link.findOne({ _id: req.params.id}, (err, link) => {
                if(link){
                    res.redirect(link.link);
                }else{
                    res.redirect('back');
                }
            })
        }
    }
}