module.exports = function(News, Comment, moment, User, Link){
    return {
        SetRouting: function(router){
            router.get('/news/show/:id', this.showNews);

            router.post('/comment/news/:id', this.newsComment);
        },
        showNews: async function(req, res){
            await News.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    views: +1
                }
            });
            if(req.user){
                var clength = req.user.comments.length;
                var nlength = req.user.newses.length;
                var llength = req.user.liked.length;
                var dlength = req.user.docs.length;
                var points = Math.ceil((clength)*20 + (nlength)*40 + (llength)*10 + (dlength)*50 + (req.user.viewsgiven)*5);
                User.updateOne({
                    _id: req.user._id
                }, {
                    $set: {
                        level: points
                    },
                    $inc: {
                        viewsgiven: +1
                    }
                }, (err) => {
                    if(err) console.log(err);
                });
            }
            var ranks = await User.find({level: { $gte: 1}}).limit(10).sort("-level").exec();
            var links = await Link.find({}).limit(10).sort("-submitted").exec();
            var dailys = await Link.find({ ctgry: 'daily'}).limit(4).sort("-submitted").exec();
            var homeworks = await Link.find({ ctgry: 'homework'}).limit(4).sort("-submitted").exec();
            var books = await Link.find({ ctgry: 'book'}).limit(4).sort("-submitted").exec();
            var idocs = await Link.find({ ctgry: 'idoc'}).limit(4).sort("-submitted").exec();
            var ccs = await Link.find({ ctgry: 'cc'}).limit(4).sort("-submitted").exec();
            const news = await News.findOne({ _id: req.params.id}).populate({ path: 'comments.comment', model: 'Comment'}).exec();
            const comments = await Comment.find({ news: req.params.id}).populate({ path: 'owner', model: 'User'}).exec();
            var errors = req.flash('error');
            res.render('news', { user: req.user, errors: errors, hasErrors: errors.length > 0, news: news, moment: moment, comments: comments, ranks: ranks, links: links, dailys: dailys, homeworks: homeworks, books: books, ccs: ccs, idocs: idocs});
        },
        newsComment: async function(req, res){

            if(req.body.content != ""){
            const newComment = new Comment();
            newComment.news = req.params.id;
            if(req.user){
                newComment.owner = req.user._id;
            }
            newComment.content = req.body.content;
            newComment.save(function(){
                console.log("Commented Succesfully");
            });

            if(req.user){
                News.updateOne({
                    _id: req.params.id
                }, {
                    $push: {
                        comments: {
                            comment: newComment._id
                        }
                    }
                }, () => {
                    console.log("News Update Successfully");
                    res.redirect('back');
                })

                User.updateOne({
                    _id: req.user._id
                }, {
                    $push: {
                        comments: {
                            comment: newComment._id
                        }
                    }
                }, () => {
                    console.log("User active");
                })
            }else{
                News.updateOne({
                    _id: req.params.id
                }, {
                    $push: {
                        comments: {
                            comment: newComment._id
                        }
                    }
                }, () => {
                    console.log("News Update Successfully");
                    res.redirect('back');
                })
            }
            }else{
                res.redirect('back')
            }
            
        }
    }
}