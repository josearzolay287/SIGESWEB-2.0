/**This script is for use the library passport to authenticate */
/**Check out in SSO with OPENID loggin query if the answer is ok, and create a session with the response information */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var OpenIDConnectStrategy = require('passport-openidconnect');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { encrypt, decrypt } = require('../controllers/crypto');
const Usuarios = require("../models/Usuarios");
// set up passport
passport.use('local',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		},
		async (req,email, password, done) => {

			try {
				const usuario = await Usuarios.findOne({
					where: {email}
				});
				if(!usuario.verifyPassword(password)) {
					return done(null, false, {
						message: 'Contraseña incorrecta'
					});
				}
				return done(null, usuario);
			}catch(err) {
                console.log("🚀 ~ file: passport.js ~ line 29 ~ err", err)
				return done(null, false, {
					message: 'Esa cuenta no existe'
				});
			}
		}
	)
);


 //inicio con google
 passport.use('google',new GoogleStrategy({
    clientID: '425427803550-5hcacf2hmbmj1k2nm1o1a5c6cg5kgk8j.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://josea.mosquedacordova.com/auth/g/call"
  },
  async (token, tokenSecret, profile, done) =>{
   console.log("🚀 ~ file: passport.js ~ line 97 ~ tokenSecret", tokenSecret)
   console.log("🚀 ~ file: passport.js ~ line 97 ~ token", token)
   console.log("🚀 ~ file: passport.js ~ line 99 ~ profile._json", profile._json)
	  const {sub, email, name, given_name, family_name}=profile._json
	   usuario = await Usuarios.findOne({where: {email: email}});
	  if (!usuario) {
		  console.log("No hay:"+ usuario);
		 usuario=  await Usuarios.create({
			  name: given_name,
			  lastName: family_name,
			  email: email,
			  password: sub,
			  validado: "ok",
			  desde:hoy,
			  hasta:hoy
		  })
		  
		  usuario.save(function(err) {
			if (err) console.log(err);
			return done(null, usuario);
		});
		  //return done(null, newuser);
	  }
   return done(null, usuario);
  }
));

// Serializar user
passport.serializeUser((user, callback) => {
	callback(null, user);
});

// Deserializar user
passport.deserializeUser((user, callback) => {
	callback(null, user);
});

module.exports = passport;