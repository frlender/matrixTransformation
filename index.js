var express = require('express');
var app = express();

app.use('/matrixTransformation',express.static(__dirname + '/public'));


var port = 2718;
app.listen(port,function(){
	console.log('server@'+port);
});
