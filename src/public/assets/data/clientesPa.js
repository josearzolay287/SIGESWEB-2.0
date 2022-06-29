/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var matricula, activematricula = 0,Inactivematricula=0, paginacion = [], grupos;
var roles;
var dtmatriculaTable = $('#matriculaTable'),
  newmatriculaidebar = $('.new-user-modal'),
  matirculaForm = $('#matirculaForm'),
  matirculaForm2 = $('#formClienteInfo2'),
  select = $('.select2'),
  dtContact = $('.dt-contact'),
  statusObj = {
    0: { title: 'Deshabilitado', class: 'badge-light-danger' },
    1: { title: 'Habilitado', class: 'badge-light-success' },
    2: { title: 'Repetido', class: 'badge-light-warning' },
    3: { title: 'Otro', class: 'badge-light-warning' }
  };

var assetPath = '../../../app-assets/';


async function getmatricula (){
 matricula=await fetch("/getRepresentantes_Alumnos_A_Escolar")
      .then((response) => response.json())
      .then((data) => {
        return data.matricula;
      });
      console.log(matricula)
      let nuevos = matricula.filter(x => x.condicionEstudiante =='Nuevo');
      let regulares = matricula.filter(x => x.condicionEstudiante =='Regular');
      let Becado = matricula.filter(x => x.condicionEstudiante =='Becado');
      $('#count-nuevos').text(nuevos.length)
$('#count-regulares').text(regulares.length)
$('#count-becados').text(Becado.length)
      createTable();
}

function createTable() {
// matricula List datatable
if (dtmatriculaTable.length) {
  $('#filtroBuscador').on('keyup change', function(){
    dataTablematricula.search(this.value).draw();   
  });
  $('#filtroRoles').on('change', function(){
    dataTablematricula.column(3).search(this.value).draw();   
  });
  let dataTablematricula = dtmatriculaTable.DataTable({
    data: matricula,
    columns: [
      // columns according to JSON
      { data: 'gradoEstudiante' },
      { data: 'cedulaEstudiante' },
      { data: 'nombreEstudiante' },
      { data: 'id_rep' },
      { data: 'id_rep' },
      { data: 'telefonosEstudiante' },
      { data: 'id_rep' },
      { data: 'condicionEstudiante' },
      { data: 'id_al' }
    ],
    columnDefs: [    
      {// User full name and username- Target 1
        targets: 2,
        render: function (data, type, full, meta) {

          var name = data,
            email = full['email'], image='';

            // For Avatar badge
            var stateNum = Math.floor(Math.random() * 6) + 1;
            var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
            var state = states[stateNum],
              initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            output = `<a href="/profile_user/${full['id']}"><span class="avatar-content">${initials}</span></a>`;
          var colorClass = image === '' ? ' bg-light-' + state + ' ' : '';
          // Creates full output for row
          var row_output =`<div class="d-flex justify-content-left align-items-center">
          <div class="avatar-wrapper">
            <div class="avatar ${colorClass} me-1">
            ${output} 
            </div>
          </div>
          <div class="d-flex flex-column">                                                    
            <a href="/profile_user/${full['id']}"><span class="fw-bolder">${name} </span></a>
            <small class="emp_post text-muted">${email}</small>
          </div>
        </div>`;
          return row_output;
        }
      },
            {// User full name and username- Target 1
              targets: 3,
              render: function (data, type, full, meta) {
                var name = full.Representantes[0].nombreRepresentante;
                return name;
              }
            },
            {// User full name and username- Target 1
              targets: 4,
              render: function (data, type, full, meta) {
                
                var cedula = full.Representantes[0].cedulaRepresentante;
                return cedula;
              }
            },
            {// User full name and username- Target 1
              targets: 6,
              render: function (data, type, full, meta) {
                
                var email = full.Representantes[0].email;
                return email;
              }
            },
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
            <a class="me-1 d-none" href="#" data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-original-title="Enviar correo" aria-label="Enviar correo">
                <span class="showName" data-name="${data}" data-bs-toggle="modal" data-bs-target="#compose-mail">
                  ${feather.icons['mail'].toSvg()}
                </span>
            </a>
            <a class="me-1" href="/estadoCuenta/${full['cedulaEstudiante']}" data-bs-toggle="tooltip"
                data-bs-placement="top" title="" data-bs-original-title="Estado Cuenta"
                aria-label="Estado Cuenta" >
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
  $('#matriculaTable_filter').addClass('d-none')
  $('.showName').click(function (e) {
    let item = e.target.getAttribute('data-name')
    $('#nombreCliente').text(item)
  })
  
}

}
$(function () {
  ('use strict');
getmatricula();
$('#btnAddCliente').click(()=>{
  matirculaForm.submit()
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
dtmatriculaTable.DataTable().clear();
  for (let i = 0; i < matricula.length; i++) {
    dtmatriculaTable.DataTable().row.add(matricula[i]);          
  }
  dtmatriculaTable.DataTable().draw()
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
function editCliente (id) {

  let filterClient = matricula.filter(item => item.id_al == id)
  console.log(filterClient)
  $('#id_al').val(filterClient[0].id_al);
  $('#nombreRepresentante').val(filterClient[0].Representantes[0].nombreRepresentante);
  $('#cedulaRepresentante').val(filterClient[0].Representantes[0].cedulaRepresentante);
  $('#representate').val(filterClient[0].id_rep);
  $('#ocupacionRepresentante').val(filterClient[0].Representantes[0].ocupacionRepresentante);
  $('#cedulaMadre').val(filterClient[0].Representantes[0].cedulaMadre);
  $('#cedulaPadre').val(filterClient[0].Representantes[0].cedulaPadre);
  $('#nombreMadre').val(filterClient[0].Representantes[0].nombreMadre);
  $('#nombrePadre').val(filterClient[0].Representantes[0].nombrePadre);
  $('#ocupacionMadre').val(filterClient[0].Representantes[0].ocupacionMadre);
  $('#ocupacionPadre').val(filterClient[0].Representantes[0].ocupacionPadre);
  $('#correo').val(filterClient[0].Representantes[0].email);

  $('#nombreEstudiante').val(filterClient[0].nombreEstudiante);
  $('#cedulaEstudiante').val(filterClient[0].cedulaEstudiante);
  $('#fechaNacimiento').val(filterClient[0].fechaNacimiento);
  $('#edadEstudiante').val(filterClient[0].edadEstudiante);
  $('#nacimientoEstudiante').val(filterClient[0].lugarnacimientoEstudiante);
  $('#direccionEstudiante').val(filterClient[0].direccionEstudiante);
  $('#telefonosEstudiante').val(filterClient[0].telefonosEstudiante);
  $('#procedenciaEstudiante').val(filterClient[0].procedenciaEstudiante);
  $('#observaciones').val(filterClient[0].observaciones);
  $('#generoEstudiante').val(filterClient[0].generoEstudiante).trigger('change');
  $('#gradoEstudiante').val(filterClient[0].gradoEstudiante).trigger('change');
  $('#condicionEstudiante').val(filterClient[0].condicionEstudiante).trigger('change');
  
  $('#buttonSubt').text('Actualizar');
  $('#addClienteBtn2').click();
}

if (matirculaForm.length) {
  matirculaForm.validate({
    errorClass: 'error',
    rules: {
      'nombreRepresentante': {
        required: true
      },
      'cedulaRepresentante': {
        required: true
      },
    }
  });

  matirculaForm.on('submit', function (e) {
    var isValid = matirculaForm.valid();        
    e.preventDefault();    
    let formArray = matirculaForm.serializeArray();
    console.log(formArray)
    if (isValid) {
      $.ajax({
        url: `/createMatricula`,
        type: 'POST',
        data: matirculaForm.serialize() ,
        success: async function (data, textStatus, jqXHR) {
          console.log(data)
          if (data.error) {
            swal.fire('Correo duplicado',data.error,'error');
          }
          if (data.matricula) {
            swal.fire('Éxito','Alumno creado con éxito','success').then(()=>{
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
  $('#nombreRepresentante').val(datos.nombreRepresentante);
  $('#cedulaRepresentante').val(datos.cedulaRepresentante);
  $('#id_representate').val(datos.id_rep);
  $('#ocupacionRepresentante').val(datos.ocupacionRepresentante);
  $('#cedulaMadre').val(datos.cedulaMadre);
  $('#cedulaPadre').val(datos.cedulaPadre);
  $('#nombreMadre').val(datos.nombreMadre);
  $('#nombrePadre').val(datos.nombrePadre);
  $('#ocupacionMadre').val(datos.ocupacionMadre);
  $('#ocupacionPadre').val(datos.ocupacionPadre);
  $('#correo').val(datos.email);
  
  // ! TIPO DNI PENDIENTE
  datos.gradoEstudiante !=='' ? $('#gradoEstudiante').val(datos.gradoEstudiante).trigger('change'): null
  
}

$('#fechaNacimiento').change(function () {
  console.log(this.value);
let now = moment();
let fechaNac = moment(this.value);
let edad = now.diff(fechaNac, 'y');
console.log(edad);
$('#edadEstudiante').val(edad);  
})