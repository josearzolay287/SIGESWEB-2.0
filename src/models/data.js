const { Op, where, Sequelize } = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");
const Usuarios = require("../models/Usuarios");
const Representantes = require("../models/Representantes");
const Alumnos = require("../models/Alumnos");
const A_Escolar = require("../models/A_Escolar");

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
      A_Escolar.findAll({where: {a_escolar:a_escolar}, include:[{association: A_Escolar.Alumnos},{association: A_Escolar.Representantes}]})
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
  RegRepresentantes(email,nombreRepresentante, cedulaRepresentante, ocupacionRepresentante,nombreMadre, cedulaMadre,ocupacionMadre, nombrePadre, cedulaPadre, ocupacionPadre) {
    return new Promise((resolve, reject) => {
      Representantes.create(
        {email: email, nombreRepresentante: nombreRepresentante, cedulaRepresentante: cedulaRepresentante, ocupacionRepresentante: ocupacionRepresentante, nombreMadre: nombreMadre, cedulaMadre: cedulaMadre, ocupacionMadre: ocupacionMadre, nombrePadre: nombrePadre, cedulaPadre: cedulaPadre, ocupacionPadre: ocupacionPadre})
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
  RegAlumnos(nombreEstudiante, cedulaEstudiante, fechaNacimiento, edadEstudiante, lugarnacimientoEstudiante, direccionEstudiante, telefonosEstudiante, procedenciaEstudiante, observaciones, generoEstudiante, gradoEstudiante, condicionEstudiante,representanteId) {
    return new Promise((resolve, reject) => {
      Alumnos.create(
        {nombreEstudiante: nombreEstudiante,   cedulaEstudiante: cedulaEstudiante,   fechaNacimiento: fechaNacimiento,   edadEstudiante: edadEstudiante,   lugarnacimientoEstudiante: lugarnacimientoEstudiante,   direccionEstudiante: direccionEstudiante,   telefonosEstudiante: telefonosEstudiante,   procedenciaEstudiante: procedenciaEstudiante,   observaciones: observaciones,   generoEstudiante: generoEstudiante,   gradoEstudiante: gradoEstudiante,   condicionEstudiante: condicionEstudiante,representanteId:representanteId})
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
  regRepsAlums_A_Escolar(a_escolar,representanteId,alumnoId){
    return new Promise((resolve, reject) => {
      A_Escolar.create(
        {a_escolar: a_escolar, representanteId: representanteId, alumnoId: alumnoId})
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

}