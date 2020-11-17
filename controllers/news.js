module.exports = function(News, Comment, moment, User){
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
            var ranks = await User.find({}).limit(10).sort("level").exec();
            const news = await News.findOne({ _id: req.params.id}).populate({ path: 'comments.comment', model: 'Comment'}).exec();
            const comments = await Comment.find({ news: req.params.id}).populate({ path: 'owner', model: 'User'}).exec();
            var errors = req.flash('error');
            res.render('news', { user: req.user, errors: errors, hasErrors: errors.length > 0, news: news, moment: moment, comments: comments, ranks: ranks});
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

                User.updateOne({
                    _id: req.user._id
                }, {
                    $push: {
                        comments: {
                            comment: newComment._id
                        }
                    }
                }, () => {
                    console.log("User Update Success")
                })

                News.updateOne({
                    _id: req.params.id
                }, {
                    $push: {
                        comments: {
                            comment: newComment._id
                        },
                        owner: req.user._id
                    }
                }, () => {
                    console.log("User News Update Successful");
                    res.redirect('back');
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