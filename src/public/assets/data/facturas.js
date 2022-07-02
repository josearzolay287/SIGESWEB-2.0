/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var facturas, activematricula = 0,Inactivematricula=0, paginacion = [], grupos;
var roles;
var dtfacturasTable = $('#facturasTable'),
  newmatriculaidebar = $('.new-user-modal'),
  facturaForm = $('#facturaForm'),
  facturaForm2 = $('#formClienteInfo2'),
  select = $('.select2'),
  dtContact = $('.dt-contact'),
  statusObj = {
    0: { title: 'Deshabilitado', class: 'badge-light-danger' },
    1: { title: 'Habilitado', class: 'badge-light-success' },
    2: { title: 'Repetido', class: 'badge-light-warning' },
    3: { title: 'Otro', class: 'badge-light-warning' }
  };

var assetPath = '../../../app-assets/';


async function getFacturas (){
 facturas=await fetch("/getFacturas_A_Escolar")
      .then((response) => response.json())
      .then((data) => {
        return data.facturas;
      });
      console.log(facturas)

      createTable();
}

function createTable() {
// matricula List datatable
if (dtfacturasTable.length) {
  let dataTablematricula = dtfacturasTable.DataTable({
    data: facturas,
    columns: [
      // columns according to JSON
      { data: 'nFactura' },
      { data: 'alumno.nombreEstudiante' },
      { data: 'monto1' },
      { data: 'createdAt' },
      { data: 'concepto' },
      { data: 'id' }
    ],
    columnDefs: [    
      {// Actions
        targets: -1,
        title: 'Actions',
        orderable: false,
        render: function (data, type, full, meta) {
          let iconEstado, labelEstado;
          full.estado == 1 ? iconEstado = feather.icons['user-x'].toSvg() :iconEstado= feather.icons['user-check'].toSvg();
          full.estado == 1 ? labelEstado = 'Deshabilitar' : labelEstado = 'Habilitar';
          return (
            ` <div class="d-flex align-items-center col-actions">
            <a class="me-1" onclick="editCliente(${data})" href="#" data-bs-toggle="tooltip"
                data-bs-placement="top" title="" data-bs-original-title="Editar"
                aria-label="Editar">
                ${feather.icons['edit-3'].toSvg()}
            </a>
            <a class="me-1" href="#" data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-original-title="Enviar correo" aria-label="Enviar correo">
                <span class="showName" data-name="${data}" data-bs-toggle="modal" data-bs-target="#compose-mail">
                  ${feather.icons['mail'].toSvg()}
                </span>
            </a>
            <a class="me-1" href="/facturas" data-bs-toggle="tooltip"
                data-bs-placement="top" title="" data-bs-original-title="Facturar"
                aria-label="Facturar">
                ${feather.icons['file-text'].toSvg()}
            </a>
            <a class="" href="#" data-bs-toggle="tooltip"
                data-bs-placement="top" title=""
                data-bs-original-title="${labelEstado}" aria-label="${labelEstado}"  onclick="changeStatus('${full.fkIdUsuario}','${full.estado}')">
                ${iconEstado}
            </a>
        </div>`
          );
        }
      }
    ],
    order: [[0, 'desc']],
    dom:
      '<"d-flex justify-content-between align-items-center header-actions mx-2 row mb-75"' +
      '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
      '<"col-sm-12 col-lg-8 ps-xl-75 ps-0"<"dt-action-buttons d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>B>>' +
      '>t' +
      '<"d-flex justify-content-between mx-2 row mb-1"' +
      '<"col-sm-12 col-md-6"i>' +
      '<"col-sm-12 col-md-6"p>' +
      '>',
    language: {
      sLengthMenu: 'Mostrar _MENU_',
      search: 'Search',
      searchPlaceholder: 'Search..',
      paginate: {
        // remove previous & next text from pagination
        previous: '&nbsp;',
        next: '&nbsp;'
      }
    },
    // Buttons with Dropdown
    buttons: [
      

    ],
    initComplete: function () {

    },
    drawCallback: function () {
     
    },
  });
  $('#facturasTable_filter').addClass('d-none')
  $('.showName').click(function (e) {
    let item = e.target.getAttribute('data-name')
    $('#nombreCliente').text(item)
  })
  
}

}
$(function () {
  ('use strict');
getFacturas();
$('#btnAddCliente').click(()=>{
  facturaForm.submit()
})
// Form Validation
});

// * EDITAR CLIENTE
async function buscaRepresentante (tipo) {
  let cedula
  switch (tipo) {
    case 'representante':
      cedula = $('#cedulaRepresentante').val()
      break;
    case 'alumno':
      cedula = $('#cedulaEstudiante').val()
      break;
  }
  
  let datos =await fetch("/getRepresentantes_Alumnos_A_Escolar/"+cedula+'/'+tipo)
  .then((response) => response.json())
  .then((data) => {
    return data.matricula;
  });
  console.log(datos)
  $('#nombreRepresentante').val(datos.Representantes[0].nombreRepresentante);
  $('#cedulaRepresentante').val(datos.Representantes[0].cedulaRepresentante);
  $('#id_representate').val(datos.Representantes[0].id_rep);
  $('#cedulaEstudiante').val(datos.cedulaEstudiante);
  $('#id_alumno').val(datos.id_al);
  $('#direccionEstudiante').val(datos.direccionEstudiante);
  $('#telefonosEstudiante').val(datos.telefonosEstudiante);
  
  // ! TIPO DNI PENDIENTE
  datos.gradoEstudiante !=='' ? $('#gradoEstudiante').val(datos.gradoEstudiante).trigger('change'): null
  
}

if (facturaForm.length) {
  facturaForm.validate({
    errorClass: 'error',
    rules: {
      'cedulaRepresentante': {
        required: true
      },
      'cedulaEstudiante': {
        required: true
      },
    }
  });

  facturaForm.on('submit', function (e) {
    var isValid = facturaForm.valid();        
    e.preventDefault();   
    
    if (isValid) {
      $.ajax({
        url: `/createFactura`,
        type: 'POST',
        data: facturaForm.serialize() ,
        success: async function (data, textStatus, jqXHR) {
          console.log(data)
          if (data.factura) {
            swal.fire('Éxito','Factura creada con éxito','success').then(()=>{
              location.reload()
            });
          }
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
      
    }
    
  });
}
