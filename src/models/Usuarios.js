const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');
//const Sucursales = require("../../models/PYT4/Sucursales");
const Usuarios = db.define('usuarios', {
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
		type: DataTypes.STRING(60),
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING(60),
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'La contraseña es obligatoria'
			}
		}
	},
	name: {
		type: DataTypes.STRING(60),
		allowNull: false,
	},
	lastName: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	tipo: {
		type: DataTypes.STRING(90),
		allowNull: true,
	},
	token: {
		type: DataTypes.STRING
	},
	expiration: {
		type: DataTypes.DATE
	},
	telefono: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
}, {
	hooks: {
		beforeCreate(usuario) {
			usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
		}
	}
});

// Métodos personalizados
Usuarios.prototype.verifyPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}

///Usuarios.Sucursales= Usuarios.belongsTo(Sucursales);


module.exports = Usuarios;

