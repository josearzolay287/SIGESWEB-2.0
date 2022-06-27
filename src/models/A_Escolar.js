const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Alumnos = require("../models/Alumnos");
const Representantes = require("../models/Representantes");
const Facturas = require("../models/Facturas");

const A_Escolar = db.define('a_escolar', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	a_escolar: {
		type: DataTypes.STRING(20),
		allowNull: true,
	},
}, 
);
A_Escolar.Alumnos= A_Escolar.hasMany(Alumnos);
A_Escolar.Representantes = A_Escolar.hasMany(Representantes);
A_Escolar.Facturas= A_Escolar.hasMany(Facturas);

module.exports = A_Escolar;

