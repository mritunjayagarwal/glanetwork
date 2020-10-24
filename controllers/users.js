module.exports = function(News, User, Link, passport, moment){
    return {
        SetRouting: function(router){
            router.get('/', this.indexpage);
            router.get('/home/:page', this.home);
            router.get('/upload', this.uploadNews);
            router.get('/like/:username/:id', this.like);
            router.get('/comment/:username/:id', this.comment);
            router.get('/logout', this.logout);
            router.get('/authenticate', this.authenticate);
            router.get('/whoweare', this.whoweare);
            router.get('/links', this.links)

            router.post('/upload', this.upload);
            router.post('/create', this.createAccount);
            router.post('/login', this.getInside);
        },
        indexpage: async function(req, res){
            if(req.user){
                res.redirect('/home/1');
            }else{
                var errors = req.flash('error');
                res.render("authenticate", { user: req.user, errors: errors, hasErrors: errors.length > 0});
            }
        },
        home: async function(req, res){
            var perPage = 8
            var page = req.params.page || 1
            var errors = req.flash('error');
            var links = await Link.find({}).limit(5).sort("-submitted").exec();
            News.find({}).skip((perPage * page) - perPage).limit(perPage).sort("-submitted").populate({ path: 'likes.owner', model: 'User'}).exec((err, news) => {
              News.countDocuments().exec((err, count) => {
                res.render("index", { user: req.user, feeds: news, moment: moment, errors: errors, hasErrors: errors.length > 0, current: page,pages: Math.ceil(count / perPage), links: links});
              })  
            });
        },
        uploadNews: function(req, res){
            res.render('upload');
        },
        upload: function(req, res){
            const newNews = new News();
            newNews.title = req.body.title;
            newNews.content = req.body.content;
            newNews.save(function(){
                res.redirect('/');
            });
        },
        like: async function(req, res){
            if(req.user){
                if(req.user.username == req.params.username){
                    News.findOne({ _id: req.params.id, 'likes.owner':req.user._id}, (err, news) => {
                        if(news){
                            News.updateOne({
                                _id: req.params.id,
                                'likes.owner': req.user._id
                            }, {
                                $pull: {
                                    likes: { owner: req.user._id}
                                }
                            }, () => {
                                console.log("Deleted");
                            });

                            User.updateOne({
                                _id: req.user._id,
                                'liked.post': req.params.id
                            }, {
                                $pull: {
                                    liked: { post: req.params.id}
                                }
                            }, (err) => {
                                console.log("Deleted user like");
                                res.redirect('back');
                            })
                        }else{
                            News.updateOne({
                                _id: req.params.id,
                                'likes.owner': { $ne: req.user._id}
                            }, {
                                $push: {
                                    likes: { owner: req.user._id}
                                }
                            },(err) => {
                                console.log("Updated Like")
                            });
        
                            User.updateOne({
                                _id: req.user._id,
                                'liked.post': { $ne: req.params.id}
                            }, {
                                $push: {
                                    liked: { post: req.params.id}
                                }
                            }, () => {
                                res.redirect('back');
                            });
                        }
                    })
                }else{
                    res.redirect('back');
                }
            }else{
                res.redirect('/');
            }
        },
        comment: function(req, res){
            News.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    comments: +1
                }
            }, () => {
                res.redirect('back');
            });
        },
        createAccount: passport.authenticate('local.signup', {
            successRedirect: 'back',
            failureRedirect: 'back',
            failureFlash: true
        }),
        getInside: passport.authenticate('local.login', {
            successRedirect: '/',
            failureRedirect: 'back',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        },
        authenticate: function(req, res){
            res.render('authenticate')
        },
        whoweare: function(req, res){
            res.send("We are who we are...I am MA");
        },
        links: async function(req, res){
            var errors = req.flash('error');
            var links = await Link.find({}).sort("-submitted").exec()
            res.render('links', { errors: errors, hasErrors: errors.length > 0, links: links, moment: moment})
        }
    }
}