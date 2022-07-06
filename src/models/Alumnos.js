const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Representantes = require("../models/Representantes");
const Alumnos = db.define('alumnos', {
	id_al: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	photo: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	nombreEstudiante: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	cedulaEstudiante: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	fechaNacimiento: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	edadEstudiante: {
		type: DataTypes.STRING(5),
		allowNull: true,
	},
	lugarnacimientoEstudiante: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	direccionEstudiante: {
		type: DataTypes.STRING(300),
		allowNull: true,
	},
	telefonosEstudiante: {
		type: DataTypes.STRING(300),
		allowNull: true,
	},
	procedenciaEstudiante: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	observaciones: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	generoEstudiante: {
		type: DataTypes.STRING(10),
		allowNull: true,
	},
	gradoEstudiante: {
		type: DataTypes.STRING(20),
		allowNull: true,
	},
	seccionEstudiante: {
		type: DataTypes.STRING(20),
		allowNull: true,
		defaultValue: 'A'
	},
	condicionEstudiante: {
		type: DataTypes.STRING(8),
		allowNull: true,
	},
}, 
);
	//Alumnos.Representantes= Alumnos.belongsTo(Representantes);

module.exports = Alumnos;

