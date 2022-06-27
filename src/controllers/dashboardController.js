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
exports.accesospage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("accesos", {
    pageName: "Accesos",
    accesos: true,
    menu: true,
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

/**GRUPOS PAGE */
exports.grupospage = async (req, res) => {

  let clientes = await DataBasequerys.getRegularClientes();
  console.log(clientes.length)
  let clientesList = clientes.filter(element => element.rol == 'regular');
  //HERE RENDER PAGE AND INTRO INFO
  res.render("grupos", {
    pageName: "Grupos",
    grupos: true,
    menu: true,clientesList
  });
};

/**EJECICIOS PAGE */
exports.ejerciciospage = async (req, res) => {
  let categorias = await DataBasequerys.getCategorias();
  let ejerciciosGym = await DataBasequerys.getEjerciciosGimnasio();
  let counEjercicios = ejerciciosGym.length;
  console.log(ejerciciosGym)
  //HERE RENDER PAGE AND INTRO INFO
  res.render("ejercicios", {
    pageName: "Ejercicios",
    ejercicios: true,
    menu: true,
    categorias, ejerciciosGym,counEjercicios
  });
};

/**PROGRAMAS PAGE */
exports.programaspage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  let categorias = await DataBasequerys.getCategorias();
  let ejerciciosGym = await DataBasequerys.getEjerciciosGimnasio();
  let ejerciciosJson = await JSON.stringify(ejerciciosGym);

  res.render("programas", {
    pageName: "Programas",
    programas: true,
    menu: true,
    categorias,
    ejerciciosJson
  });
};

/**EVENTOS PAGE */
exports.eventospage = async (req, res) => {
  let gruposList = await DataBasequerys.getGruposGimnasio();
  //HERE RENDER PAGE AND INTRO INFO
  res.render("eventos", {
    pageName: "Eventos",
    eventos: true,
    menu: true,
    gruposList
  });
};

/**WOD PAGE */
exports.wodpage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("wod", {
    pageName: "WOD",
    wod: true,
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

/**APROBACIONES PAGE */
exports.aprobacionespage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("aprobaciones", {
    pageName: "Aprobaciones",
    aprobaciones: true,
    menu: true,
  });
};

/**PRODUCTOS PAGE */
exports.productospage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("productos", {
    pageName: "Productos",
    productos: true,
    menu: true,
  });
};

/**REPORTES PAGE */
exports.reportespage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("reportes", {
    pageName: "Reportes",
    reportes: true,
    menu: true,
  });
};

/**REPORTAR PROBLEMA PAGE */
exports.reportproblempage = async (req, res) => {
  //HERE RENDER PAGE AND INTRO INFO
  res.render("reportproblem", {
    pageName: "Reportar Problema",
    reportproblem: true,
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

/**AGREGAR CLIENTE */
exports.addCliente = async (req, res) => {
  res.render("agregar-cliente", {
    pageName: "Agregar Cliente",
    addCliente: true,
    menu: true,
  });
};

/**AGREGAR EJERCICIO */
exports.addEjercicio = async (req, res) => {
  res.render("agregar-ejercicio", {
    pageName: "Agregar Ejercicio",
    addEjercicio: true,
    menu: true,
  });
};

/**AGREGAR PROGRAMA */
exports.addPrograma = async (req, res) => {
  res.render("agregar-programa", {
    pageName: "Agregar Programa",
    addPrograma: true,
    menu: true,
  });
};

/**AGREGAR FACTURA */
exports.addFactura = async (req, res) => {
  res.render("agregar-factura", {
    pageName: "Agregar Factura",
    addFactura: true,
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
  const {nombreRepresentante, cedulaRepresentante,ocupacionRepresentante, nombreMadre,cedulaMadre, ocupacionMadre,nombrePadre,cedulaPadre, ocupacionPadre, correo,nombreEstudiante, cedulaEstudiante,fechaNacimiento,edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones,  generoEstudiante, gradoEstudiante,condicionEstudiante} = req.body;
  let a_escolar = 1,regRepre,regAlumno,regMatricula;
  let matricula=[]
    let verifyRepresentante = JSON.parse(await DataBasequerys.RepresentanteByCedula(cedulaRepresentante));
    console.log(verifyRepresentante)
    if (!verifyRepresentante) {
      regRepre = JSON.parse(await DataBasequerys.RegRepresentantes(correo,nombreRepresentante, parseInt(cedulaRepresentante), ocupacionRepresentante,nombreMadre, parseInt(cedulaMadre),ocupacionMadre, nombrePadre, parseInt(cedulaPadre), ocupacionPadre,a_escolar));
      console.log(regRepre)
      let regAlumno = JSON.parse(await DataBasequerys.RegAlumnos(nombreEstudiante, parseInt(cedulaEstudiante), fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,regRepre['id_rep'],a_escolar));
      console.log(regAlumno)
    } else {
      console.log(verifyRepresentante)
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
/**UPDATE EVENTO GIMNASIO */
exports.updateCalendarEvent = async (req, res) => {
  console.log(req.body);
  const {id, title,start, end, extendedProps,url,repetir} = req.body;
  console.log(extendedProps);
  let newEvent;
  let newEventGrupo;
    newEvent = await DataBasequerys.updateEventosbyGimnasio(id, title,start, end, extendedProps.description,url,extendedProps.fkIdGimnasio,extendedProps.notificacionEnviada,extendedProps.color,extendedProps.entrenador,  extendedProps.precio, extendedProps.espacios,repetir);
    newEventGrupo = await DataBasequerys.updateEventosGrupo(id,extendedProps.calendar);
  

  

 return res.send({newEvent});
};
/**delete EVENTO GIMNASIO */
exports.deleteCalendarEvent = async (req, res) => {
  console.log(req.body);
  const {pkIdEvento} = req.body;
  console.log(pkIdEvento)
   let deleteEventGrupo = await DataBasequerys.deleteEventosGrupo(pkIdEvento);
   let deleteEvent = await DataBasequerys.deleteEventosbyGimnasio(pkIdEvento);
 return res.send({deleteEvent,deleteEventGrupo});
};