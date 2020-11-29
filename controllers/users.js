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
            router.get('/links/:page', this.links);
            router.get('/member/signup/', this.signup)

            router.post('/upload', this.upload);
            router.post('/create', this.createAccount);
            router.post('/login', this.getInside);
        },
        indexpage: async function(req, res){
            res.redirect("/home/1")
            // if(req.user){
            //     res.redirect('/home/1');
            // }else{
            //     var errors = req.flash('error');
            //     res.render("authenticate", { user: req.user, errors: errors, hasErrors: errors.length > 0});
            // }
        },
        home: async function(req, res){
            var perPage = 8
            var page = req.params.page || 1
            var errors = req.flash('error');
            var links = await Link.find({}).limit(10).sort("-submitted").exec();
            if(req.user){
                var clength = req.user.comments.length;
                var nlength = req.user.newses.length;
                var llength = req.user.liked.length;
                var dlength = req.user.docs.length;
                var points = Math.ceil((clength)*20 + (nlength)*40 + (llength)*10 + (dlength)*50);
                User.updateOne({
                    _id: req.user._id
                }, {
                    $set: {
                        level: points
                    }
                }, (err) => {
                    if(err) console.log(err);
                });
            }
            var ranks = await User.find({level: { $gte: 1}}).limit(10).sort("-level").exec();
            var dailys = await Link.find({ ctgry: 'daily'}).limit(4).sort("-submitted").exec();
            var homeworks = await Link.find({ ctgry: 'homework'}).limit(4).sort("-submitted").exec();
            var books = await Link.find({ ctgry: 'book'}).limit(4).sort("-submitted").exec();
            var idocs = await Link.find({ ctgry: 'idoc'}).limit(4).sort("-submitted").exec();
            var ccs = await Link.find({ ctgry: 'cc'}).limit(4).sort("-submitted").exec();
            News.find({}).skip((perPage * page) - perPage).limit(perPage).sort("-submitted").populate({ path: 'likes.owner', model: 'User'}).exec((err, news) => {
              News.countDocuments().exec((err, count) => {
                res.render("index", { user: req.user, feeds: news, moment: moment, errors: errors, hasErrors: errors.length > 0, current: page,pages: Math.ceil(count / perPage), links: links, ranks: ranks, dailys: dailys, homeworks: homeworks, books: books, idocs: idocs, ccs: ccs});
              })  
            });
        },
        uploadNews: function(req, res){
            if(req.user){
                res.render('upload', { user: req.user});
            }else{
                res.redirect('/member/signup')
            }
        },
        upload: function(req, res){
            if(req.user){
                const newNews = new News();
                newNews.title = req.body.title;
                newNews.owner = req.user._id;
                newNews.content = req.body.content;
                newNews.save(function(){
                    console.log("News Uploaded");
                });

                User.updateOne({
                    _id: req.user._id
                }, {
                    $push: {
                        newses: {
                            news: newNews._id
                        }
                    }
                }, (err) => {
                    console.log("User Updated");
                    res.redirect('/home/1')
                })
            }else{
                res.redirect('/')
            }
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
        signup: function(req, res){
            if(req.user){
                res.redirect('/home/1/')
            }else{
                res.render('signup')
            }
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
            if(req.user){
                res.redirect('/home/1/')
            }else{
                res.render('authenticate')
            }
        },
        whoweare: async function(req, res){
            if(req.user){
                var clength = req.user.comments.length;
                var nlength = req.user.newses.length;
                var llength = req.user.liked.length;
                var dlength = req.user.docs.length;
                var points = Math.ceil((clength)*20 + (nlength)*40 + (llength)*10 + (dlength)*50);
                User.updateOne({
                    _id: req.user._id
                }, {
                    $set: {
                        level: points
                    }
                }, (err) => {
                    if(err) console.log(err);
                });
            }
            var ranks = await User.find({level: { $gte: 1}}).limit(10).sort("-level").exec();
            var errors = req.flash('error');
            res.render('about-us', {user: req.user, errors: errors, hasErrors: errors.length > 0, ranks: ranks});
        },
        links: async function(req, res){
            var perPage = 9;
            var page = req.params.page || 1;
            var errors = req.flash('error');
            if(req.user){
                var clength = req.user.comments.length;
                var nlength = req.user.newses.length;
                var llength = req.user.liked.length;
                var dlength = req.user.docs.length;
                var points = Math.ceil((clength)*20 + (nlength)*40 + (llength)*10 + (dlength)*50);
                User.updateOne({
                    _id: req.user._id
                }, {
                    $set: {
                        level: points
                    }
                }, (err) => {
                    if(err) console.log(err);
                });
            }
            var ranks = await User.find({level: { $gte: 1}}).limit(10).sort("-level").exec();
            Link.find({}).skip((perPage * page) - perPage).limit(perPage).sort("-submitted").exec((err, links) => {
                Link.countDocuments().exec((err, count) => {
                    res.render('links', {user: req.user, errors: errors, hasErrors: errors.length > 0, links: links, moment: moment, current: page,pages: Math.ceil(count / perPage), ranks: ranks});
                })
            });
        }
    }
}