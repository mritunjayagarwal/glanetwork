const dependable = require('dependable');
const path = require('path');
const container = dependable.container();
const myModules = [
    ['_', 'lodash'],
    ['News', './models/news'],
    ['User', './models/user'],
    ['Comment', './models/comment'],
    ['Link', './models/link'],
    ['passport', 'passport'],
    ['async', 'async'],
    ['moment', 'moment']
];

myModules.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register(container, function(){
    return container;
});

module.exports = container;