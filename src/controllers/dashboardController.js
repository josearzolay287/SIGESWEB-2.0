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
let a_escolar = '2022-2021';
let matricula = await DataBasequerys.RepsAlums_A_Escolar(a_escolar);
console.log(matricula)
return res.send({matricula});
};

/**CREATE MATRICULA */
exports.createMatricula = async (req, res) => {
  console.log(req.body);
  const {nombreRepresentante, cedulaRepresentante,ocupacionRepresentante, nombreMadre,cedulaMadre, ocupacionMadre,nombrePadre,cedulaPadre, ocupacionPadre, correo,nombreEstudiante, cedulaEstudiante,fechaNacimiento,edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones,  generoEstudiante, gradoEstudiante,condicionEstudiante} = req.body;
  let a_escolar = '2022-2021';
    let verifyRepresentante = JSON.parse(await DataBasequerys.RepresentanteByCedula(cedulaRepresentante));
    console.log(verifyRepresentante)
    if (!verifyRepresentante) {
      let regRepre = JSON.parse(await DataBasequerys.RegRepresentantes(correo,nombreRepresentante, cedulaRepresentante, ocupacionRepresentante,nombreMadre, cedulaMadre,ocupacionMadre, nombrePadre, cedulaPadre, ocupacionPadre));
      console.log(regRepre)
      let regAlumno = JSON.parse(await DataBasequerys.RegAlumnos(nombreEstudiante, cedulaEstudiante, fechaNacimiento, edadEstudiante, nacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,regRepre['id']));
      console.log(regRepre)
      let regMatricula = JSON.parse(await DataBasequerys.regRepsAlums_A_Escolar(a_escolar,regRepre['id'],regAlumno['id']))
      console.log(regRepre)
    } else {
      console.log(verifyRepresentante)
    }

 return res.send({newEvent});
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