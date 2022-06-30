const passport = require("passport");//THIS MODULE USE FOR AUTHENTICATE SESSION
//const crypto = require("crypto");//THIS MODULE USE TO ENCRYPT OR DECRYPT
const { encrypt, decrypt } = require('./crypto');
const axios = require('axios').default;
var moment = require("moment-timezone");
const DataBasequerys = require("../models/data");// Functions for querys
const io = require("./socketio.js").getIO();

/** FUNCTION TO RENDER LOGGIN PAGE */
exports.formLogin = async (req, res) => {
  let error = false
  if (req.session.errorLogin) {
    error = req.session.errorLogin;
  }
  res.render("login", {
    pageName: "Login",
    layout: "page-form",
    login: true,
    error,
    messages: error
  });
};

/**FUNCTION TO CLOSE SESSION */
exports.closeSesion =async (req, res) => {
  const user = res.locals.user;//USER INFO

  
};
exports.loginUser = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});


exports.sesionstart = (req, res) => {
  let msg = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      
      return res.redirect("/login");
    }
    req.logIn(user, async function (err) {
      if (err) {
          return next(err);
      }

      req.session.a_escolar = req.body.a_escolar;

      return res.redirect("/dashboard");
    });
  })(req, res);
};
exports.logintemp = (req, res) => {
  console.log(req.user.tipo);
  let tipo = req.user.tipo  
  if (tipo == 'Empresa') {
    res.redirect('/dashboard')
  }
  if (tipo == 'Cliente') {
    res.redirect('/dash_cliente')
  }
  if (tipo == 'Administrador') {
    res.redirect('/dashboard')
  }
       
};

exports.pinTest = async (req, res) => {
console.log(req.body)
const {email, password} = req.body;
let verifypin
let fallido
let fecha = moment().format('YYYY-MM-DD H:mm:ss');
let tipo = 'habilitado'
let verifytelefono = await DataBasequerys.checktlf_PIN(email,'telefono');
let msg={}
console.log(verifytelefono[0])
if (verifytelefono.length > 0) {
  verifypin = await DataBasequerys.checkPIN(email,password);
  console.log(verifypin)
  if (verifypin.length > 0) {
    fallido = await DataBasequerys.regIngreso(verifytelefono[0]['pkIdUsuario'], verifytelefono[0]['fkIdGimnasio'], fecha, 'Y', 'N', tipo, 'insert');
    msg.usuario = verifytelefono[0]['nombre'] + ' '+ verifytelefono[0]['apellido1'] + ' '+ verifytelefono[0]['apellido2'];
    msg.tipo = 'Correcto';
    io.sockets.emit("messages", msg);
    res.redirect('/login')
    
  }else{
    if (verifytelefono[0]['rol'] != 'regular') {
      tipo = verifytelefono[0]['rol'];
    }
    fallido = await DataBasequerys.regIngreso(verifytelefono[0]['pkIdUsuario'], verifytelefono[0]['fkIdGimnasio'], fecha, 'Y', 'Y', tipo, 'insert');
    msg.usuario = verifytelefono[0]['nombre'] + ' '+ verifytelefono[0]['apellido1'] + ' '+ verifytelefono[0]['apellido2'];
    msg.tipo = 'Fallido';
    io.sockets.emit("messages", msg);
    res.redirect('/login')
  } 
}


};
/**FUNCTION TO CHANGE PASSWORD */
exports.changePassword =async (req, res) => {
  const {newPassword,pkIdUsuario} = req.body
  console.log(req.body)
let cryptoPassword = encrypt(newPassword);

let saveNewPassword = await DataBasequerys.updatePassword(pkIdUsuario, cryptoPassword);

return res.send({saveNewPassword})
  
};

