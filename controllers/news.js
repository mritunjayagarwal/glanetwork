module.exports = function(News){
    return {
        SetRouting: function(router){
            router.get('/news/show/:id', this.showNews);
        },
        showNews: async function(req, res){
            const news = await News.findOne({ _id: req.params.id}).exec();
            var errors = req.flash('error');
            res.render('news', { user: req.user, errors: errors, hasErrors: errors.length > 0, news: news});
        }
    }
}