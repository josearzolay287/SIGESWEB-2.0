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
router.get('/', dashboardController.dashboard);

// LOGGIN
router.get('/login', userController.formLogin);
router.get('/login/:token', userController.formLogin);
router.post('/login', userController.pinTest);
router.post('/changePassword', userController.changePassword);
// CLOSE SESSION
router.get('/close-session', userController.closeSesion);

//Enlaces principales
router.get('/dashboard', dashboardController.dashboard);
router.get('/matricula', dashboardController.matriculaPage);
router.get('/facturas', dashboardController.facturaspage);
router.get('/profile_user/:id', dashboardController.profilePage);
router.get('/estadoCuenta/:cedulaEstudiante', dashboardController.estadoCuenta);


/**Gets or Post info from mysql */
router.get('/getRepresentantes_Alumnos_A_Escolar', dashboardController.getRepresentantes_Alumnos_A_Escolar);
router.get('/getRepresentantes_Alumnos_A_Escolar/:cedula/:tipo', dashboardController.getRepresentantes_Alumnos_A_EscolarbyCedula);
router.get('/getFacturas_A_Escolar', dashboardController.getFacturas_A_Escolar);
router.get('/getFacturas_alumno/:id_al', dashboardController.getFacturas_alumno);
router.post('/createMatricula', dashboardController.createMatricula);
router.post('/createFactura', dashboardController.createFactura);


module.exports = router;