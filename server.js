var express = require('express'),
  cluster = require('cluster'),
  os = require('os'),
  app = express();

app.use(express.static(__dirname + '/dist'));
//app.use(express.logger('dev'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/dist/index.html');
});


app.use(function(req, res, next) {
  res.sendfile(__dirname + req.url);
});


if (cluster.isMaster) {
  for (var i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('listening', function(worker, address) {
    console.log("Worker "+worker.process.pid+" listening on: "+address.port);
  });

} else {

  app.listen(3000);
}