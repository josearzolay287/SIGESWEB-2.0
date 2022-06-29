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
  let a_escolar = 1
  let id_al = req.params.cedulaEstudiante
  let alumno = JSON.parse(await DataBasequerys.Alu_A_EscolarCedula(a_escolar,id_al));
  console.log(alumno)
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

/**FACTURAS PAGE */
exports.facturaspage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("facturas", {
    pageName: "Facturas",
    facturas: true,
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
  console.log(profileinfo);
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
  console.log('getclientesRegular')
let a_escolar = 1;
let matricula = JSON.parse(await DataBasequerys.RepsAlums_A_Escolar(a_escolar));
console.log(matricula.representantes)
return res.send({matricula});
};
exports.getRepresentantes_Alumnos_A_EscolarbyCedula = async (req, res) => {
  console.log('getclientesRegular')
let a_escolar = 1;
let tipo = req.params.tipo;
let cedula = req.params.cedula;

let matricula
if (tipo == 'representante') {
  matricula = JSON.parse(await DataBasequerys.Reps_A_EscolarCedula(a_escolar,cedula));
}
if (tipo == 'alumno') {
  matricula = JSON.parse(await DataBasequerys.Alu_A_EscolarCedula(a_escolar,cedula));
}
console.log(matricula)
return res.send({matricula});
};

/**CREATE MATRICULA */
exports.createFactura = async (req, res) => {
  console.log(req.body);
  const {id_a_escolar,  id_representate,  id_alumno,  tipoFactura,  concetoFactura,  mesCancelarFactura,  numeroFactura,  tipoPagoFactura,  referenciaFactura, BancoFactura, fechaTransFactura,  observaciones,  montoDFactura,  montoBFactura } = req.body;
  const a_escolar = 1;
  let matricula=[]
    let factura = JSON.parse(await DataBasequerys.RegFacturas_A_Escolar(tipoFactura,concetoFactura,mesCancelarFactura,numeroFactura,tipoPagoFactura,referenciaFactura,BancoFactura,fechaTransFactura,observaciones,montoDFactura,montoBFactura,a_escolar,id_alumno,id_representate))
    console.log(factura)
 return res.send({factura});
};
exports.createMatricula = async (req, res) => {
  console.log(req.body);
  const {id_al,nombreRepresentante, cedulaRepresentante,ocupacionRepresentante, nombreMadre,cedulaMadre, ocupacionMadre,nombrePadre,cedulaPadre, ocupacionPadre, correo,nombreEstudiante, cedulaEstudiante,fechaNacimiento,edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones,  generoEstudiante, gradoEstudiante,condicionEstudiante,representate} = req.body;
  let a_escolar = 1,regRepre,regAlumno,regMatricula;
  let matricula=[];
  if (id_al) {
    regRepre = JSON.parse(await DataBasequerys.UpdRepresentantes(correo,nombreRepresentante, parseInt(cedulaRepresentante), ocupacionRepresentante,nombreMadre, parseInt(cedulaMadre),ocupacionMadre, nombrePadre, parseInt(cedulaPadre), ocupacionPadre,a_escolar,representate));
      console.log(regRepre)
      regAlumno = JSON.parse(await DataBasequerys.UpdAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,representate,a_escolar,id_al));
  }else{
    let verifyRepresentante = JSON.parse(await DataBasequerys.RepresentanteByCedula(cedulaRepresentante));
    console.log(verifyRepresentante)
    if (!verifyRepresentante) {
      regRepre = JSON.parse(await DataBasequerys.RegRepresentantes(correo,nombreRepresentante, parseInt(cedulaRepresentante), ocupacionRepresentante,nombreMadre, parseInt(cedulaMadre),ocupacionMadre, nombrePadre, parseInt(cedulaPadre), ocupacionPadre,a_escolar));
      console.log(regRepre)
      let regAlumno = JSON.parse(await DataBasequerys.RegAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,regRepre['id_rep'],a_escolar));
      console.log(regAlumno)
    } else {
      console.log(verifyRepresentante)
      let regAlumno = JSON.parse(await DataBasequerys.RegAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,verifyRepresentante['id_rep'],a_escolar));
      console.log(regAlumno)
    }
  }
    

    matricula.push({representante:regRepre,alumno:regAlumno})
    
 return res.send({matricula});
};


exports.getFacturas_A_Escolar = async (req, res) => {
  console.log('getFacturas_A_Escolar')
let a_escolar = 1;
let facturas = JSON.parse(await DataBasequerys.Facturas_A_Escolar(a_escolar));
console.log(facturas)
return res.send({facturas});
};
exports.getFacturas_alumno = async (req, res) => {
  console.log('getFacturas_alumno')
let id_al = req.params.id_al;
let facturas = JSON.parse(await DataBasequerys.Facturas_A_alumno(id_al));
console.log(facturas)
return res.send({facturas});
};