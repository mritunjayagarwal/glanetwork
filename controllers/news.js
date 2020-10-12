module.exports = function(News, Comment, moment){
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
            const news = await News.findOne({ _id: req.params.id}).populate({ path: 'comments.comment', model: 'Comment'}).exec();
            var errors = req.flash('error');
            res.render('news', { user: req.user, errors: errors, hasErrors: errors.length > 0, news: news, moment: moment, comments: news.comments});
        },
        newsComment: async function(req, res){

            if(req.body.content != ""){
                const newComment = new Comment();
            newComment.news = req.params.id;
            newComment.content = req.body.content;
            newComment.save(function(){
                console.log("Commented Succesfully");
            });

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
            }else{
                res.redirect('back')
            }
            
        }
    }
}