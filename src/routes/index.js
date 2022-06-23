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
router.get('/grupos', dashboardController.grupospage);
router.get('/ejercicios', dashboardController.ejerciciospage);
router.get('/programas', dashboardController.programaspage);
router.get('/eventos', dashboardController.eventospage);
router.get('/wod', dashboardController.wodpage);
router.get('/facturas', dashboardController.facturaspage);
router.get('/aprobaciones', dashboardController.aprobacionespage);
router.get('/productos', dashboardController.productospage);
router.get('/reportes', dashboardController.reportespage);
router.get('/reportproblem', dashboardController.reportproblempage);
router.get('/profile_user/:id', dashboardController.profilePage);
router.get('/profile_gimnasio', dashboardController.profileGym);
router.get('/agregar-cliente', dashboardController.addCliente);
router.get('/agregar-factura', dashboardController.addFactura);
router.get('/agregar-ejercicio', dashboardController.addEjercicio);
router.get('/agregar-programa', dashboardController.addPrograma);

/**Gets or Post info from mysql */
router.get('/getRepresentantes_Alumnos_A_Escolar', dashboardController.getRepresentantes_Alumnos_A_Escolar);
router.get('/getRepresentantes_Alumnos_A_Escolar/:cedula/:tipo', dashboardController.getRepresentantes_Alumnos_A_EscolarbyCedula);
router.post('/createMatricula', dashboardController.createMatricula);


module.exports = router;