const { Op, where, Sequelize } = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");
const Usuarios = require("../models/Usuarios");
const Representantes = require("../models/Representantes");
const Alumnos = require("../models/Alumnos");
const A_Escolar = require("../models/A_Escolar");
const Facturas = require("../models/Facturas");

module.exports = {
  //USUARIO
  RegUser(tipo, nombre, email, password, zona) {
    return new Promise((resolve, reject) => {
      Usuarios.create(
        {
         name: nombre, tipo: tipo, email: email, password: password, sucursaleId:zona})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
          //console.log(planes);
        })
        .catch((err) => {
          reject(err)
        });
    });
  },
  UsuariobyId(id){
    return new Promise((resolve, reject) => {
      Usuarios.findOne({
        where: {
          id: id,
        },
      })
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  UsuariobyAll(){
    return new Promise((resolve, reject) => {
      Usuarios.findAll({order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ["updatedAt", "DESC"],
      ],
      })
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  UsuarioDelete(id){
    return new Promise((resolve, reject) => {
      Usuarios.destroy({where: {
        id: id,
      },
      })
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },

  /**REPRESENTATES ALUMNOS*/
  RepsAlums_A_Escolar(a_escolar){
    return new Promise((resolve, reject) => {
      Alumnos.findAll({where: {aEscolarId:a_escolar}, include:[{association: Representantes.Alumnos}]})
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  Reps_A_EscolarCedula(a_escolar,cedula){
    return new Promise((resolve, reject) => {
      Representantes.findOne({where: {aEscolarId:a_escolar, cedulaRepresentante: cedula}})
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  Alu_A_EscolarCedula(a_escolar,cedula){
    return new Promise((resolve, reject) => {
      Alumnos.findOne({where: {aEscolarId:a_escolar,cedulaEstudiante: cedula}, include:[{association: Representantes.Alumnos}]})
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  RepresentanteByCedula(cedulaRepresentante){
    return new Promise((resolve, reject) => {
      Representantes.findOne({where:{cedulaRepresentante:cedulaRepresentante}},{order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ["updatedAt", "DESC"],
      ],
      })
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  UpdRepresentantes(email,nombreRepresentante, cedulaRepresentante, ocupacionRepresentante,nombreMadre, cedulaMadre,ocupacionMadre, nombrePadre, cedulaPadre, ocupacionPadre,aEscolarId,id_rep) {
    return new Promise((resolve, reject) => {
      Representantes.update(
        {email: email, nombreRepresentante: nombreRepresentante, cedulaRepresentante: cedulaRepresentante, ocupacionRepresentante: ocupacionRepresentante, nombreMadre: nombreMadre, cedulaMadre: cedulaMadre, ocupacionMadre: ocupacionMadre, nombrePadre: nombrePadre, cedulaPadre: cedulaPadre, ocupacionPadre: ocupacionPadre,aEscolarId:aEscolarId}, {where:{id_rep:id_rep}})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
          //console.log(planes);
        })
        .catch((err) => {
          console.log(err)
        });
    });
  },
  RegRepresentantes(email,nombreRepresentante, cedulaRepresentante, ocupacionRepresentante,nombreMadre, cedulaMadre,ocupacionMadre, nombrePadre, cedulaPadre, ocupacionPadre,aEscolarId) {
    return new Promise((resolve, reject) => {
      Representantes.create(
        {email: email, nombreRepresentante: nombreRepresentante, cedulaRepresentante: cedulaRepresentante, ocupacionRepresentante: ocupacionRepresentante, nombreMadre: nombreMadre, cedulaMadre: cedulaMadre, ocupacionMadre: ocupacionMadre, nombrePadre: nombrePadre, cedulaPadre: cedulaPadre, ocupacionPadre: ocupacionPadre,aEscolarId:aEscolarId})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
          //console.log(planes);
        })
        .catch((err) => {
          console.log(err)
        });
    });
  },
  UpdAlumnos(nombreEstudiante, cedulaEstudiante, fechaNacimiento, edadEstudiante, lugarnacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,id_rep,aEscolarId,id_al) {
    return new Promise((resolve, reject) => {
      Alumnos.update(
        {nombreEstudiante: nombreEstudiante,   cedulaEstudiante: cedulaEstudiante,   fechaNacimiento: fechaNacimiento,   edadEstudiante: edadEstudiante,   lugarnacimientoEstudiante: lugarnacimientoEstudiante,   direccionEstudiante: direccionEstudiante,   telefonosEstudiante: telefonosEstudiante,   procedenciaEstudiante: procedenciaEstudiante,   observaciones: observaciones,   generoEstudiante: generoEstudiante,   gradoEstudiante: gradoEstudiante,   condicionEstudiante: condicionEstudiante,id_rep:id_rep,aEscolarId:aEscolarId},{where:{id_al:id_al}})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
          //console.log(planes);
        })
        .catch((err) => {
          console.log(err)
        //  reject(err)
        });
    });
  },
  RegAlumnos(nombreEstudiante, cedulaEstudiante, fechaNacimiento, edadEstudiante, lugarnacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,id_rep,aEscolarId) {
    return new Promise((resolve, reject) => {
      Alumnos.create(
        {nombreEstudiante: nombreEstudiante,   cedulaEstudiante: cedulaEstudiante,   fechaNacimiento: fechaNacimiento,   edadEstudiante: edadEstudiante,   lugarnacimientoEstudiante: lugarnacimientoEstudiante,   direccionEstudiante: direccionEstudiante,   telefonosEstudiante: telefonosEstudiante,   procedenciaEstudiante: procedenciaEstudiante,   observaciones: observaciones,   generoEstudiante: generoEstudiante,   gradoEstudiante: gradoEstudiante,   condicionEstudiante: condicionEstudiante,id_rep:id_rep,aEscolarId:aEscolarId})
        .then((data) => {
          let data_set = JSON.stringify(data);
          resolve(data_set);
          //console.log(planes);
        })
        .catch((err) => {
          console.log(err)
        //  reject(err)
        });
    });
  },
  regRepsAlums_A_Escolar(a_escolar,id_rep,alumnoId){
    return new Promise((resolve, reject) => {
      A_Escolar.create(
        {a_escolar: a_escolar, id_rep: id_rep, alumnoId: alumnoId})
        .then((data) => {
          let data_p = JSON.stringify(data);
          resolve(data_p);
          ////console.log(id_usuario);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
/**FACTURAS */

Facturas_A_Escolar(a_escolar){
  return new Promise((resolve, reject) => {
    Facturas.findAll({where: {aEscolarId:a_escolar}, include:[{association: Facturas.Alumnos},{association: Facturas.Representantes}]})
      .then((data) => {
        let data_p = JSON.stringify(data);
        resolve(data_p);
        ////console.log(id_usuario);
      })
      .catch((err) => {
        console.log(err);
      });
  });
},
Facturas_A_alumno(id_al){
  return new Promise((resolve, reject) => {
    Facturas.findAll({where: {representanteIdRep:id_al}, include:[{association: Facturas.Alumnos},{association: Facturas.Representantes}]})
      .then((data) => {
        let data_p = JSON.stringify(data);
        resolve(data_p);
        ////console.log(id_usuario);
      })
      .catch((err) => {
        console.log(err);
      });
  });
},
RegFacturas_A_Escolar(tipo,concepto,mesCancelar,nFactura,tipoPago,referencia,banco,fechaTransaccion,observaciones,monto0,monto1,aEscolarId,alumnoId,id_rep) {
  return new Promise((resolve, reject) => {
    Facturas.create(
      {tipo: tipo,concepto: concepto,mesCancelar: mesCancelar,nFactura: nFactura,tipoPago: tipoPago,referencia: referencia,banco: banco,fechaTransaccion: fechaTransaccion,observaciones: observaciones,monto0: monto0,monto1: monto1,aEscolarId:aEscolarId,alumnoIdAl:alumnoId,representanteIdRep:id_rep})
      .then((data) => {
        let data_set = JSON.stringify(data);
        resolve(data_set);
        //console.log(planes);
      })
      .catch((err) => {
        console.log(err)
      });
  });
},
}