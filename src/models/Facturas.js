const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
const Alumnos = require("../models/Alumnos");
const Representantes = require("../models/Representantes");
const Facturas = db.define('facturas', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	tipo: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	concepto: {
		type: DataTypes.STRING(150),
		allowNull: true,
	},
	mesCancelar: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	nFactura: {
		type: DataTypes.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	tipoPago: {
		type: DataTypes.STRING(155),
		allowNull: true,
	},
	referencia: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	banco: {
		type: DataTypes.STRING(300),
		allowNull: true,
	},
	fechaTransaccion: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	observaciones: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	monto0: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	monto1: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
}, 
);
Facturas.Alumnos= Facturas.belongsTo(Alumnos);
Facturas.Representantes = Facturas.belongsTo(Representantes);

module.exports = Facturas;

