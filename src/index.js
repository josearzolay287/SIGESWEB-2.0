const express = require('express');
const router = express.Router();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const fileupload = require('express-fileupload');
var connection = require('mysql');  
const db = require('./config/db')  
// Conectar con la base de datos
db.sync()
 	.then(() => {

 		console.log('Base de datos conectada jjaa2');

 	})
 	.catch(err => {
        console.log("🚀 ~ file: index.js ~ line 21 ~ err", err);
 	});

// Create the server express
const app = express();
const sio = require('./controllers/socketio.js');
// var privateKey = fs.readFileSync('/home/UECSM/ssl/keys/ab1dd_57dd1_52e9b6dd61094f54c54f24130417fcfe.key').toString();
// var certificate = fs.readFileSync('/home/UECSM/ssl/certs/UECSM_mosquedacordova_com_ab1dd_57dd1_1659657599_1cd42aca914de0b1f661b5a853113c36.crt').toString();  
//         var options = {
//                 key:privateKey,
//                 cert: certificate
//         };
var server = require("http").createServer(app);
sio.init(server);

    server.listen(5001, function () {
      console.log(`Server in port ${app.get('port')}`)
	console.log("Servidor corriendo en https://localhost:5004");
  });

// Body parser and file upload controller
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileupload());

app.use('/api', router);
// Settigns of expressnp: PORT
app.set('port', process.env.PORT || 5001);

// Views directory
app.set('views', path.resolve(__dirname, './views'));

// Setting template engine
app.engine('.hbs', exphbs.engine({
	layoutsDir: path.resolve(app.get('views'), 'layouts'),
	partialsDir: path.resolve(app.get('views'), 'partials'),
	defaultLayout: 'main',
	extname: '.hbs',
	helpers: require('./libs/handlebars')
}));

app.set('view engine', '.hbs');

// Public directory
app.use(express.static(path.resolve(__dirname, './public')));

// Flash Messages
app.use(flash());

//Cookies parser
app.use(cookieParser());

// Sesiones
app.use(session({
	secret: 'super-secret',
	resave: false,
	saveUninitialized: false
}));

//Passport module
app.use(passport.initialize());
app.use(passport.session());

//User session
app.use(async (req, res, next) => {	
	
	res.locals.messages = req.flash();
	res.locals.user = {...req.user} || null;	
	if (req.user) {
		req.user.a_escolar = req.session.a_escolar;
		req.user.a_escolarString = req.session.a_escolarString;
	}
	next();
});

// Routes
app.use('/', require('./routes'));
process.on('uncaughtException', async function(e, promise) {
	process.exitCode;
  });