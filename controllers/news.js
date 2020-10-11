module.exports = function(News, moment){
    return {
        SetRouting: function(router){
            router.get('/news/show/:id', this.showNews);
        },
        showNews: async function(req, res){
            await News.updateOne({
                _id: req.params.id
            }, {
                $inc: {
                    views: +1
                }
            });
            const news = await News.findOne({ _id: req.params.id}).exec();
            var errors = req.flash('error');
            res.render('news', { user: req.user, errors: errors, hasErrors: errors.length > 0, news: news, moment: moment});
        }
    }
}