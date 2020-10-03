module.exports = function(News){
    return {
        SetRouting: function(router){
            router.get('/', this.home);
            router.get('/upload', this.uploadNews);
            router.get('/like/:id', this.like);
            router.get('/comment/:id', this.comment);
            router.post('/upload', this.upload);
        },
        home: async function(req, res){
            const news = await News.find({}).sort("-submitted").exec();
            res.render("index", { feeds: news});
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
                    comment: +1
                }
            }, () => {
                res.redirect('back');
            });
        }
    }
}