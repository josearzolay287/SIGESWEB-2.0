/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var facturas, alumnos,id_rep = $('#id_al').text();
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
 facturas=await fetch("/getFacturas_repre/"+id_rep)
      .then((response) => response.json())
      .then((data) => {
        return data.facturas;
      });
      console.log(facturas)

      createTable();
      getAlumnos ();
}
async function getAlumnos (){
  alumnos=await fetch("/getAlumnosbyRepresentantes/"+id_rep)
       .then((response) => response.json())
       .then((data) => {
         return data.alumnos;
       });
  console.log("🚀 ~ file: estadocuenta.js ~ line 41 ~ getAlumnos ~ alumnos", alumnos);
  for (let i = 0; i < alumnos.length; i++) {
    let option = `<option value="${alumnos[i].nombreEstudiante}">${alumnos[i].nombreEstudiante}</option>`;
    $('#alumnos').append(option);
  }
 }

function createTable() {
  $('#alumnos').on('change', function(){

    dtfacturasTable.DataTable().column(1).search(this.value).draw();   
  });
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
      { data: 'mesCancelar' },
      { data: 'observaciones' },
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
            <a class="me-1" onclick="verFactura(${full['id']})" href="#" data-bs-toggle="tooltip"
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

async function changeStatus(id, estadoActual) {
  let newStado = 0,labelEstado;
  if (estadoActual == 0) {
    newStado = 1;
  }
  estadoActual == 1 ? labelEstado = 'deshabilitar' : labelEstado = 'habilitar';
   const data = new FormData();
      data.append("fkIdUsuarioInfo", id);
      data.append("estado", newStado);
  Swal.fire({
    title: '¿Está seguro?',
    text: `Seguro desea ${labelEstado} a este cliente`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/deshabilitaCliente`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
    success: async function (data, textStatus, jqXHR) {  
      if (newStado == 0) {
         swal.fire('Actualizado','Se deshabilitó con éxito al cliente','success');
      } else {
         swal.fire('Actualizado','Se habilitó con éxito al cliente','success');
      }          
     
      matricula=await fetch("/getmatriculaRegular")
.then((response) => response.json())
.then((data) => {
  return data.matricula;
});
paginacion = matricula[matricula.length-1];
matricula.pop();
let habilitados = 0, deshabilitados = 0;
matricula.forEach(element => {
  if (element.estado == 1) {
    habilitados++
  }
  if (element.estado == 0) {
    deshabilitados ++
  }        
});
$('#count-habilitados').text(habilitados);
$('#count-deshabilitados').text(deshabilitados);
dtfacturasTable.DataTable().clear();
  for (let i = 0; i < matricula.length; i++) {
    dtfacturasTable.DataTable().row.add(matricula[i]);          
  }
  dtfacturasTable.DataTable().draw()
      $('#add-cliente').modal('hide');
      return
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });

    }
  })
 
 
  
}

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
function verFactura (id) {

  let filterF = facturas.filter(item => item.id == id)
  console.log(filterF)
  $('#id_al').val(filterF[0].id_al);
  $('#nombreEstudiante').val(filterF[0].alumno.nombreEstudiante);
  $('#gradoEstudiante').val(filterF[0].alumno.gradoEstudiante);
  $('#tipoFactura').val(filterF[0].tipo);
  $('#concetoFactura').val(filterF[0].concepto);
  $('#mesCancelarFactura').val(filterF[0].mesCancelar);
  $('#numeroFactura').val(filterF[0].nFactura);
  $('#tipoPagoFactura').val(filterF[0].tipoPago).trigger('change');
  $('#referenciaFactura').val(filterF[0].referencia);
  $('#BancoFactura').val(filterF[0].banco);
  $('#fechaTransFactura').val(moment(filterF[0].fechaTransaccion).format('YYYY-MM-DD'));
  $('#observaciones').val(filterF[0].observaciones);

  $('#montoDFactura').val(filterF[0].monto0);
  $('#montoBFactura').val(filterF[0].monto1);

  $('#add-factura').modal('show');
}
