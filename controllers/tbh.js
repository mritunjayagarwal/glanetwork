module.exports = function(User, moment){
    return {
        SetRouting: function(router){
            router.get('/tbh/:username', this.tbh);
        },
        tbh: async function(req,res){
            var errors = req.flash('error');
            res.render('tbh', {user: req.user, vuser: req.params.username, moment: moment, errors: errors, hasErrors: errors.length > 0});
        }
    }
}