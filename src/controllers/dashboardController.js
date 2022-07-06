const fs = require("fs");
const path = require("path");
const axios = require('axios').default;
var moment = require("moment-timezone");
var DataBasequerys = require("../models/data");// Functions for querys
const { encrypt, decrypt } = require("./crypto");//Encrypt / decrypt
const io = require("./socketio.js").getIO();
/**FUNCTION TO RENDER dashboard PAGE */
exports.dashboard = async (req, res) => {
  
  //HERE RENDER PAGE AND INTRO INFO
  res.render("dashboard", {
    pageName: "Dashboad",
    dashboard: true,
    menu: true,
  });
};

/**ACCESSO PAGE */
exports.estadoCuenta = async (req, res) => {
  let user = res.locals.user
  let a_escolar = user.a_escolar
  let id_al = req.params.cedulaEstudiante
  let alumno = JSON.parse(await DataBasequerys.Alu_A_EscolarCedula(a_escolar,id_al));
  //HERE RENDER PAGE AND INTRO INFO
  res.render("estadocuenta", {
    pageName: "Estado Cuenta",
    estadoCuenta: true,
    menu: true,
    alumno  
  });
};

/**CLIENTES PAGE */
exports.matriculaPage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("matricula", {
    pageName: "Matricula",
    matricula: true,
    menu: true,
  });
};
/**CLIENTES PAGE */
exports.usuariosPage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("usuarios", {
    pageName: "Usuarios",
    usuarios: true,
    menu: true,
  });
};

/**FACTURAS PAGE */
exports.facturaspage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("facturas", {
    pageName: "Facturas",
    facturas: true,
    menu: true,
  });
};
/**REPORTES PAGE */
exports.reportes = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("reportes", {
    pageName: "Reportes",
    reportes: true,
    menu: true,
  });
};

/**PERFIL USER PAGE */
exports.profilePage = async (req, res) => {
  let id_user = req.params.id;
  let profileinfo = await DataBasequerys.getUserbyfkIdUsuario(id_user);
  let gruposCliente = await DataBasequerys.getGruposBypkIdUsuario(id_user);
  let medidas = await DataBasequerys.getMedidasBypkIdUsuario(id_user);
  let ingresos = await DataBasequerys.getIngresosByfkIdUsuario(id_user);
  let categorias = await DataBasequerys.getCategorias();
  medidas = medidas.slice(0, 8);
//console.log(medidas)
  profileinfo = profileinfo[0];
  res.render("profile-user", {
    pageName: "Perfil",
    profilePage: true,
    menu: true,
    profileinfo,
    gruposCliente,
    medidas,ingresos,categorias
  });
};

/**PERFIL GYM PAGE */
exports.profileGym = async (req, res) => {
  res.render("profile-gym", {
    pageName: "Perfil Gimnasio",
    profileGym: true,
    menu: true,
  });
};

/**----------------------------------START GETS / POST FUNCTIONS------------------------------------ */
/**------------------------------------------------------------------------------------------------ */

/**getRepresentantes_Alumnos_A_Escolar */
exports.getRepresentantes_Alumnos_A_Escolar = async (req, res) => {
  let user = res.locals.user
  let a_escolar = user.a_escolar
let matricula = JSON.parse(await DataBasequerys.RepsAlums_A_Escolar(a_escolar));
return res.send({matricula});
};
exports.getRepresentantes_Alumnos_A_EscolarbyCedula = async (req, res) => {
  let user = res.locals.user
  let a_escolar = user.a_escolar
let tipo = req.params.tipo;
let cedula = req.params.cedula;

let matricula
if (tipo == 'representante') {
  matricula = JSON.parse(await DataBasequerys.Reps_A_EscolarCedula(a_escolar,cedula));
}
if (tipo == 'alumno') {
  matricula = JSON.parse(await DataBasequerys.Alu_A_EscolarCedula(a_escolar,cedula));
}
return res.send({matricula});
};

/**CREATE MATRICULA */
exports.createFactura = async (req, res) => {
  let user = res.locals.user;
  const a_escolar = user.a_escolar;
  console.log("🚀 ~ file: dashboardController.js ~ line 123 ~ exports.createFactura= ~ a_escolar", a_escolar)
  const {id_a_escolar,  id_representate,  id_alumno,  tipoFactura,  concetoFactura,  mesCancelarFactura,  numeroFactura,  tipoPagoFactura,  referenciaFactura, BancoFactura, fechaTransFactura,  observaciones,  montoDFactura,  montoBFactura } = req.body;
  let matricula=[]
    let factura = JSON.parse(await DataBasequerys.RegFacturas_A_Escolar(tipoFactura,concetoFactura,mesCancelarFactura,numeroFactura,tipoPagoFactura,referenciaFactura,BancoFactura,fechaTransFactura,observaciones,montoDFactura,montoBFactura,a_escolar,id_alumno,id_representate))
    
 return res.send({factura});
};
exports.createMatricula = async (req, res) => {
  const {id_al,nombreRepresentante, cedulaRepresentante,ocupacionRepresentante, nombreMadre,cedulaMadre, ocupacionMadre,nombrePadre,cedulaPadre, ocupacionPadre, correo,nombreEstudiante, cedulaEstudiante,fechaNacimiento,edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones,  generoEstudiante, gradoEstudiante,condicionEstudiante,representate,seccionEstudiante} = req.body;
  let user = res.locals.user;
  let a_escolar = user.a_escolar,regRepre,regAlumno,regMatricula;
  let matricula=[];
  if (id_al) {
    regRepre = JSON.parse(await DataBasequerys.UpdRepresentantes(correo,nombreRepresentante, parseInt(cedulaRepresentante), ocupacionRepresentante,nombreMadre, parseInt(cedulaMadre),ocupacionMadre, nombrePadre, parseInt(cedulaPadre), ocupacionPadre,a_escolar,representate));
     
      regAlumno = JSON.parse(await DataBasequerys.UpdAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,representate,a_escolar,id_al,seccionEstudiante));
  }else{
    let verifyRepresentante = JSON.parse(await DataBasequerys.RepresentanteByCedula(cedulaRepresentante));
   
    if (!verifyRepresentante) {
      regRepre = JSON.parse(await DataBasequerys.RegRepresentantes(correo,nombreRepresentante, parseInt(cedulaRepresentante), ocupacionRepresentante,nombreMadre, parseInt(cedulaMadre),ocupacionMadre, nombrePadre, parseInt(cedulaPadre), ocupacionPadre,a_escolar));
      
      let regAlumno = JSON.parse(await DataBasequerys.RegAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,regRepre['id_rep'],a_escolar,seccionEstudiante));
      
    } else {
      let regAlumno = JSON.parse(await DataBasequerys.RegAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,verifyRepresentante['id_rep'],a_escolar,seccionEstudiante));
      
    }
  }
    

    matricula.push({representante:regRepre,alumno:regAlumno})
    
 return res.send({matricula});
};


exports.getFacturas_A_Escolar = async (req, res) => {
  let user = res.locals.user
  let a_escolar = user.a_escolar
let facturas = JSON.parse(await DataBasequerys.Facturas_A_Escolar(a_escolar));
return res.send({facturas});
};

exports.getFacturas_repre = async (req, res) => {
let id_rep = req.params.id_rep;
let user = res.locals.user;
let a_escolar = user.a_escolar;
let facturas = JSON.parse(await DataBasequerys.Facturas_A_represente(id_rep,a_escolar));
return res.send({facturas});
};
exports.getAlumnosbyRepresentantes = async (req, res) => {
let id_rep = req.params.id_rep;
let user = res.locals.user;
let a_escolar = user.a_escolar;
let alumnos = JSON.parse(await DataBasequerys.alumnos_A_represente(id_rep,a_escolar));
return res.send({alumnos});
};

exports.getUsuarios = async (req, res) => {
//let id_al = req.params.id_al;
let usuarios = JSON.parse(await DataBasequerys.UsuariobyAll());
return res.send({usuarios});
};

exports.createusuarios = async (req, res) => {
  const {idUsuario, nombre, email, tipo, password } = req.body;
  const a_escolar = 1;
    let usuario = JSON.parse(await DataBasequerys.RegUser(tipo, nombre, email, password))
 return res.send({usuario});
};