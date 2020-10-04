module.exports = function(News, User, passport){
    return {
        SetRouting: function(router){
            router.get('/', this.home);
            router.get('/upload', this.uploadNews);
            router.get('/like/:id', this.like);
            router.get('/comment/:id', this.comment);
            router.get('/logout', this.logout);

            router.post('/upload', this.upload);
            router.post('/create', this.createAccount);
            router.post('/login', this.getInside);
        },
        home: async function(req, res){
            const news = await News.find({}).sort("-submitted").exec();
            var errors = req.flash('error');
            res.render("index", { user: req.user, feeds: news, errors: errors, hasErrors: errors.length > 0});
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
        like: function(req, res){
            News.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    likes: +1
                }
            }, () => {
                res.redirect('back');
            });
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
            successRedirect: 'back',
            failureRedirect: 'back',
            failureFlash: true
        }),
        logout: function(req, res){
            req.logout();
            res.redirect('/');
        }
    }
}