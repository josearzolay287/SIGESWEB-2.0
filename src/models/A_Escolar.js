const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Alumnos = require("../models/Alumnos");
const Representantes = require("../models/Representantes");

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
A_Escolar.Alumnos= A_Escolar.belongsTo(Alumnos);
A_Escolar.Representantes = A_Escolar.belongsTo(Representantes);

module.exports = A_Escolar;

