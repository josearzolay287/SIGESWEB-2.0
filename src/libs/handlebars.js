var moment = require('moment-timezone');
const { encrypt, decrypt } = require('../controllers/crypto'); // ENCRYPT - DECRYPT MODULE

module.exports = {
	showAlerts: (message = {}, alerts) => { //Alerts message
		const categoria = Object.keys(message);
		let html = '';
		if (categoria.length) {
			html += '<div class="form-message-container">';
			message[categoria].forEach(error => {
				html += `<p class="form-message text-danger">${error}</p>`;
			});
			html += '</div>';
		}
		return alerts.fn().html = html;
	},
	tipomembresia: (Rol) => {//Show Rol description
		switch (Rol) {
			case '1':
				return 'Mensual';
				break;
			case '3':
				return 'Trimestral';
				break;
			case '6':
				return 'Semestral';
				break;
			case '12':
				return 'Anual';
				break;
			default:
				return 'Check out Support Please';
				break;
		}
	},
	cardHide: (card) => { // Hide card number, only show last 4 numbers
		card = decrypt(card);
		let hideNum = [];
		for (let i = 0; i < card.length; i++) {
			if (i < card.length - 4) {
				hideNum.push("*");
			} else {
				hideNum.push(card[i]);
			}
		}
		return hideNum.join("");
	},
	decryptData: (value1) => {//Decrypt Data
		let encrypted = decrypt(value1);
		return encrypted;
	},
	GetCardType: (number) => {//Get Card Type and show
		 number = decrypt(number);
		// visa
		var re = new RegExp("^4");
		if (number.match(re) != null)
			return "Visa";

		// Mastercard 
		// Updated for Mastercard 2017 BINs expansion
		if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
			return "Mastercard";//MAST

		// AMEX
		re = new RegExp("^3[47]");
		if (number.match(re) != null)
			return "AMEX";

		// Discover
		re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
		if (number.match(re) != null)
			return "Discover";//this DISC

		// Diners
		re = new RegExp("^36");
		if (number.match(re) != null)
			return "Diners";

		// Diners - Carte Blanche
		re = new RegExp("^30[0-5]");
		if (number.match(re) != null)
			return "Diners - Carte Blanche";

		// JCB
		re = new RegExp("^35(2[89]|[3-8][0-9])");
		if (number.match(re) != null)
			return "JCB";

		// Visa Electron
		re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
		if (number.match(re) != null)
			return "Visa Electron";//VISA

		return "";
	},
	format_date: (date) => {
		if (date == '0000-00-00') {
			return '';
		}
		let newDate= moment(date).toDate();
		return moment(newDate).format('DD/MM/YYYY, h:mm:ss a');///.format('MM/DD/YYYY');
	},
	format_date_2: (date) => {
		if (date == '0000-00-00') {
			return '';
		}
		let newDate= moment(date).toDate();
		return moment(newDate).format('DD/MM/YYYY');///.format('MM/DD/YYYY');
	},
	format_date_3: (date) => {
		if (date == '0000-00-00') {
			return '';
		}
		let newDate= moment(date).format('YYYY-MM-DD');
		return newDate;///.format('MM/DD/YYYY');
	},
	format_date_4: (date) => {
		if (date == '0000-00-00') {
			return '';
		}
		let newDate= moment(date).locale('es').format('LLL');
		return newDate;///.format('MM/DD/YYYY');
	},
	diasRestantes: (proximoPago) => {
		let dias;
		let ingreso = moment();
		proximoPago = moment(proximoPago,'YYYY-MM-DD');
		dias = proximoPago.diff(ingreso,'d')
		return dias;///.format('MM/DD/YYYY');
	},
	graficarMedidas: (val, num) => {
		console.log(val, num)
		let info = "";
		if (val != 0) {
			info = `<td class="text-center text-primary fw-bolder">
				<div class="fw-bolder cursor-pointer"
					onclick="graficar('${num}')">
					${val}
				</div>
			</td>`
		} else {
			info = `<td class="text-center text-primary">
				<div class="">
					${val}
				</div>
			</td>`
		}
		return info
	},
	alertDiasAtencion: (proximoPago) => {
		let dias;
		let ingreso = moment();
		proximoPago = moment(proximoPago,'YYYY-MM-DD');
		dias = proximoPago.diff(ingreso,'d');
		let msj = `<div class="alert alert-success mb-2" role="alert">
		<h6 class="alert-heading">¡Todo en orden! </h6>
		
	</div>`;
	if (dias < 8) {
		msj = `<div class="alert alert-warning mb-2" role="alert">
		<h6 class="alert-heading">¡Necesitamos su atención! </h6>
		<div class="alert-body fw-normal">su plan requiere actualización
		</div>
	</div>`;
	}
		return msj;///.format('MM/DD/YYYY');
	},
	tax_calculate: (mountWOT, mountWT) => {

		let tax = parseFloat(mountWT) - parseFloat(mountWOT)
		return tax.toFixed(2);
	},
	decimals: (mount) => {	
		return Number.parseFloat(mount).toFixed(2)
	},	
	classActive: (position) => {
		let classAc ="";
		if (position == 0){
			classAc ="active";
		}
		return classAc
	},
	phonenumberFormat: (number)=> {
		if( number ) {
			return number.replace( /\D+/g, "" ).replace( /([0-9]{1,3})([0-9]{3})([0-9]{4}$)/gi, "($1) $2-$3" ); //mask numbers (xxx) xxx-xxxx	
		} else {
			return "";
		}
	},
	alterQuill: (valor)=> {
		var text = valor.replace(/(\r\n|\n|\r)/gm, '<br>');
		return text;
	},
	historiaClinica: (valor)=> {
		var text;
		if (valor=="" || valor == null) {
			text = 'No presenta ninguna complicación médica';
		}else{
			text = valor;
		}
		return text;
	},
	historiaClinicaColor: (valor)=> {
		var clase;
		if (valor=="" || valor == null) {
			clase = 'alert-success';
		}else{
			clase = 'alert-danger';
		}
		return clase;
	},
	profileHabilitado: (estado) => {
		let text = "";
		switch (parseInt(estado)) {
			case 1:
				text = '<span class="badge bg-light-success">Habilitado</span>'
				break;
				
			case 0:
				text = '<span class="badge bg-light-danger">Deshabilitado</span>'
				break;
		}
		return text;
	}

}
