var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var celebrities = require('./routes/celebrities');

var app = express();


//Mongoose
mongoose.Promise = global.Promise;

// var url = 'mongodb://localhost:27017/akinodb';
var url = 'mongodb://admin:admin@ds235788.mlab.com:35788/akinodb';

mongoose.connect(url).then(() => {
	console.log('connection success');
}).catch(error => {
	console.log('Connect fail: ', error.stack);
	process.exit(1);
});


//Handlebars
const hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('equal', (arg1, arg2, options) => {
	return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', celebrities);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
