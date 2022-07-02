/**This script is for use the library passport to authenticate */
/**Check out in SSO with OPENID loggin query if the answer is ok, and create a session with the response information */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var OpenIDConnectStrategy = require('passport-openidconnect');
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



// Serializar user
passport.serializeUser((user, callback) => {
	callback(null, user);
});

// Deserializar user
passport.deserializeUser((user, callback) => {
	callback(null, user);
});

module.exports = passport;