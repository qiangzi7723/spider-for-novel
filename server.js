const open = require('open');
module.exports = (app, server,express) => {
    app.use(express.static('./template'));
    server.listen(9090);
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/template/index.html');
    });
    open('http://localhost:9090');
};
