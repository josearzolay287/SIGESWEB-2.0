const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Alumnos = require("../models/Alumnos");

const Representantes = db.define('representantes', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	photo: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	email: {
		type: DataTypes.STRING(150),
		allowNull: true,
	},
	nombreRepresentante: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	cedulaRepresentante: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	ocupacionRepresentante: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	nombreMadre: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	cedulaMadre: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	ocupacionMadre: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	nombrePadre: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	cedulaPadre: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	ocupacionPadre: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},	
}, 
);

Representantes.Alumnos= Representantes.hasMany(Alumnos);


module.exports = Representantes;

