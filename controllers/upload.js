const link = require("../models/link");

module.exports = function(Link, User){
    return {
        SetRouting: function(router){
            router.post('/uploadlink', this.uploadlink);
            router.get('/visit/:id', this.visit);
            router.get('/openwa', this.openwa)
        },
        uploadlink: async function(req, res){
            if(req.user){
                var owner = await User.findOne({ username: req.body.owner}).exec();
                oid = owner._id;
                const newLink = new Link();
                newLink.owner = oid;
                newLink.title = req.body.title;
                newLink.ctgry = req.body.category;
                newLink.section = req.body.section;
                newLink.link = req.body.link;
                newLink.save(function(err){
                    if(err) console.log(err);
                });
                User.updateOne({
                    username: req.body.owner
                }, {
                    $push: {
                        docs: { doc: newLink._id}
                    }
                }, (err) => {
                    res.redirect('back');
                })
            }
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
        },
        openwa: function(req, res){
            res.render('blank', {user: req.user})
        }
    }
}