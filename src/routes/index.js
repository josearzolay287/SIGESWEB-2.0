/**HERE ARE ALL ROUTES */
const router = require('express').Router();//USE EXPRESS ROUTER
const userController = require('../controllers/userController');//LOGGIN AND REGISTER USER FUNCTIONS
const authController = require('../controllers/authController');//AUTH FUNCTIONS
const dashboardController = require('../controllers/dashboardController');//PRINCIPALS FUNCTIONS
const mailCtrl = require('../controllers/mailCtrl');//EMAIL FUNCTIONS (SEND EMAIL)
const FileController = require('../models/upload');//FUNCTION TO UPLOAD FILES
const fileController = new FileController();
const passport = require("passport");//THIS MODULE USE FOR AUTHENTICATE SESSION

// Landing Page LOGGIN
router.get('/', authController.authenticatedUser, dashboardController.dashboard);

// LOGGIN
router.get('/login', userController.formLogin);
router.get('/login/:token', userController.formLogin);
router.post('/login', userController.sesionstart);
router.post('/changePassword', userController.changePassword);
// CLOSE SESSION
router.get('/close-session', userController.closeSesion);

//Enlaces principales
router.get('/dashboard',authController.authenticatedUser, dashboardController.matriculaPage);
router.get('/matricula',authController.authenticatedUser, dashboardController.matriculaPage);
router.get('/usuarios',authController.authenticatedUser, dashboardController.usuariosPage);
router.get('/facturas',authController.authenticatedUser, dashboardController.facturaspage);
router.get('/reportes',authController.authenticatedUser, dashboardController.reportes);
router.get('/estadoCuenta/:cedulaEstudiante',authController.authenticatedUser, dashboardController.estadoCuenta);


/**Gets or Post info from mysql */
router.get('/getRepresentantes_Alumnos_A_Escolar', authController.authenticatedUser,dashboardController.getRepresentantes_Alumnos_A_Escolar);
router.get('/getRepresentantes_Alumnos_A_Escolar/:cedula/:tipo', authController.authenticatedUser,dashboardController.getRepresentantes_Alumnos_A_EscolarbyCedula);
router.get('/getFacturas_A_Escolar',authController.authenticatedUser, dashboardController.getFacturas_A_Escolar);
router.get('/getUsuarios',authController.authenticatedUser, dashboardController.getUsuarios);
router.get('/getFacturas_repre/:id_rep', authController.authenticatedUser,dashboardController.getFacturas_repre);
router.get('/getAlumnosbyRepresentantes/:id_rep', authController.authenticatedUser,dashboardController.getAlumnosbyRepresentantes);


router.post('/createMatricula',authController.authenticatedUser, dashboardController.createMatricula);
router.post('/createFactura', authController.authenticatedUser,dashboardController.createFactura);
router.post('/createusuarios',authController.authenticatedUser, dashboardController.createusuarios);


module.exports = router;