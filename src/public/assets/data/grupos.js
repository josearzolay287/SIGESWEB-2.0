/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var grupos, activegrupos = 0,Inactivegrupos=0, paginacion = [];
var dtgruposTable = $('#gruposTable'),
  newgruposidebar = $('#addGrupo'),
  grupoForm = $('#addEditGrupoForm'),
  select = $('.select2'),
  statusObj = {
    0: { title: 'Deshabilitado', class: 'badge-light-danger' },
    1: { title: 'Habilitado', class: 'badge-light-success' },
    2: { title: 'Repetido', class: 'badge-light-warning' },
    3: { title: 'Otro', class: 'badge-light-warning' }
  };
async function getgrupos (){
 grupos=await fetch("/getgruposGimnasio")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        $('#total_grupos').text(data.gruposList.length);
        return data.gruposList;
      });
      console.log(grupos);
      createTable();
}
function createTable() {


// grupos List datatable
if (dtgruposTable.length) {
  $('#buscadorGrupos').on('keyup change', function(){
    dataTableGrupos.search(this.value).draw();   
  });

  let dataTableGrupos = dtgruposTable.DataTable({
    data: grupos,
    columns: [
      // columns according to JSON
      { data: 'nombre' },
      //{ data: 'fkIdGimnasio' },
      { data: 'createAt' },
      { data: '' }
    ],
    columnDefs: [      
{// User Status target 3
        targets:0,
        render: function (data, type, full, meta) {
          return (`<span id="nombre${full['pkIdGrupoGimnasio']}">${data}</span>`
          );
        }
      },
      {// User TOTP target 4
        targets: 1,
        render: function (data, type, full, meta) {
          let fecha = moment(data).format('DD/MM/YYYY')
          return (`<span class="badge bg-info text-capitalize">${fecha}</span>`
          );
        }
      },
      {// Actions
        targets: -1,
        title: 'Actions',
        orderable: false,
        render: function (data, type, full, meta) {
          return (
            ` <div class="d-flex align-items-center col-actions">
            <a href="#" class="me-1 showNameGroup" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Detalles" onclick="showNameGroup('${full.pkIdGrupoGimnasio}','${full.nombre}')">
              ${feather.icons['eye'].toSvg({ class: 'font-small-4 showNameGroup', 'data-name': `${full.nombre}`,'data-id': `${full.pkIdGrupoGimnasio}`})}
            </a>
            <a class="me-1" onclick="editGrupo('${full.pkIdGrupoGimnasio}','${meta.row}')" href="#" data-bs-toggle="tooltip"
                data-bs-placement="top" title="" data-bs-original-title="Editar"
                aria-label="Editar">
                ${feather.icons['edit-3'].toSvg()}
            </a>
            <a class="delete-record${full.pkIdGrupoGimnasio}" href="#" data-bs-toggle="tooltip"
                data-bs-placement="top" title=""
                data-bs-original-title="Eliminar" aria-label="Eliminar" onclick="deleteGrupo('${full.pkIdGrupoGimnasio}')">
                ${feather.icons['trash'].toSvg()}
            </a>
        </div>`
          );
        }
      }
    ],
    order: [[0, 'asc']],
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
      search: 'Buscar',
      searchPlaceholder: 'Buscar..',
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
      $(document).find('[data-bs-toggle="tooltip"]').tooltip();
      var info = dtgruposTable.DataTable().page.info();
      var currentP = parseInt(info.page)+1;
      var LastP = parseInt(info.pages);
      let nextPagetoCharge = paginacion.next;
      console.log(nextPagetoCharge);
      if (!nextPagetoCharge) {
        return;
      }
        if (currentP == LastP) {
           $("#gruposTable .pagination").append(
            `<div class="spinner"></div>`
          );        
          nextPage(nextPagetoCharge,currentP)
         
        }
    },
  });
  $('#gruposTable_filter').addClass('d-none')

}

// Form Validation
if (grupoForm.length) {
  grupoForm.validate({
    errorClass: 'error',
    rules: {
      'nombreGrupo': {
        required: true
      },
    }
  });

  grupoForm.on('submit', function (e) {
    var isValid = grupoForm.valid();    
    e.preventDefault();
    if (isValid) {
      $.ajax({
        url: `/saveNewGrupoGym`,
        type: 'POST',
        data: grupoForm.serialize(),
        success: async function (data, textStatus, jqXHR) {
          console.log(data);
          grupos=await fetch("/getgruposGimnasio")
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            return data.gruposList;
          });
          if ($('#pkIdGrupoGimnasio').val()== '') {
            dtgruposTable.DataTable().row.add(data.grupoById[0]).draw();
            newgruposidebar.modal('hide');
            let sumaCount = parseInt($('#total_grupos').text()) + 1;
            $('#total_grupos').text(sumaCount);
           return
          } 
          let rowNum = $('#rowNum').val();
          let id=$('#pkIdGrupoGimnasio').val()
          var cell = $(`#nombre${id}`).closest("td");
          console.log(rowNum)
          console.log(id)
          dtgruposTable.DataTable().row(rowNum).cell(cell).data(`${$('#nombreGrupo').val()}`).draw();
          newgruposidebar.modal('hide');
          
          
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
      
    }
  });



}

}
$(function () {

  ('use strict');
getgrupos();


});
async function showNameGroup(id, name) {
  $('#nombreGrupoDetalles').text(name);
  $('#fkIdGrupo').val(id)
  let grupos_info=await fetch("/getUsuariosGrupos/"+id)
  .then((response) => response.json())
  .then((data) => {
    return data.response;
  });
  console.log(grupos_info);
  $('#resultados_info-grupo').text(grupos_info.length)
  $('#info-grupoTable').DataTable().destroy();
  $('#info-grupoTable').DataTable( {
    data:grupos_info,
    columns: [
      { data: 'nombre' },
      { data: 'rol' },
      { data: '' }
    ],
    columnDefs: [ 
      {// User full name and username- Target 0
        targets: 0,
        render: function (data, type, full, meta) {
          var name = full['nombre']+ " "+full['apellido1'] + " "+full['apellido2'],
            email = full['correo'], image='';

            // For Avatar badge
            var stateNum = Math.floor(Math.random() * 6) + 1;
            var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
            var state = states[stateNum],
              initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            output = `<a href="/profile_user/${full['fkIdUsuario']}"><span class="avatar-content">${initials}</span></a>`;
          var colorClass = image === '' ? ' bg-light-' + state + ' ' : '';
          // Creates full output for row
          var row_output =`<div class="d-flex justify-content-left align-items-center">
          <div class="avatar-wrapper">
            <div class="avatar ${colorClass} me-1">
            ${output} 
            </div>
          </div>
          <div class="d-flex flex-column">                                                    
            <a href="#"><span class="fw-bolder">${name} </span></a>
            <small class="emp_post text-muted">${email}</small>
          </div>
        </div>`;
          return row_output;
        }
      },
      {// User TOTP target 4
        targets: 1,
        render: function (data, type, full, meta) {
          let text = full.rol;
          if (full.rol == "regular") {
            text = "Cliente"
          }
          return (`<span class="badge bg-info text-capitalize">${text}</span>`
          );
        }
      },
            {// Actions
              targets: -1,
              title: 'Opciones',
              orderable: false,
              render: function (data, type, full, meta) {
                return (
                  ` <div class="d-flex align-items-center col-actions">
                  <a class="delete-record${full.pkIdUsuarioGrupo}" href="#" data-bs-toggle="tooltip"
                      data-bs-placement="top" title=""
                      data-bs-original-title="Eliminar" aria-label="Eliminar" onclick="deleteCliente_Grupo('${full.pkIdUsuarioGrupo}')">
                      ${feather.icons['trash'].toSvg()}
                  </a>
              </div>`
                );
              }
            }
          ],
          "bLengthChange" : false,
          
  } );
  $('#info-grupo').modal('show');  
}
// * EDIT GRUPO
function editGrupo(id, rowNum) {
  console.log(id)
  let filterGrupo = grupos.filter(item => item.pkIdGrupoGimnasio == id)
  console.log(filterGrupo)
  $('#modalGrupoTitle').text("Editar Grupo");
  $('#pkIdGrupoGimnasio').val(filterGrupo[0].pkIdGrupoGimnasio);
  $('#nombreGrupo').val(filterGrupo[0].nombre)
  $('#rowNum').val(rowNum)
  $('#editGrupoBtn').click();
}

$('#addGrupoBtn').click(function (e) { 
  $('#modalGrupoTitle').text("Añadir Nuevo Grupo");
  $('#idGrupoEdit').val("");
  $('#nombreGrupo').val("")
});

function deleteGrupo(id) {
   const data = new FormData();
      data.append("pkIdGrupoGimnasio", id);
  Swal.fire({
    title: 'Seguró desea eliminar?',
    text: "Seguro desea eliminar el grupo, luego no se podrá revertir la operación",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#007EA8',
    cancelButtonColor: '#C24B63',
    confirmButtonText: 'Si!',
    cancelButtonText: 'No!',
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/deleteGrupoGym`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      if (data.deleteGrupo0.errno) {
        if (data.deleteGrupo0.errno == 1451) {
          Swal.fire(
            'Error de Borrado!',
            'Grupo seleccionado no se puede borrar, esta asignado a uno o más usuario(s) y/o evento(s).',
            'error'
          )
          return
        }
      }
      dtgruposTable.DataTable().row($(`#gruposTable tbody .delete-record${id}`).parents('tr')).remove().draw();
      let sumaCount = parseInt($('#total_grupos').text()) -1;
            $('#total_grupos').text(sumaCount);
      Swal.fire(
        'Borrado!',
        'Grupo borrado con éxito.',
        'success'
      )
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });

    }
  })
 
 
  
}

function deleteCliente_Grupo(id) {
  const data = new FormData();
     data.append("pkIdUsuarioGrupo", id);
     $.ajax({
       url: `/deleteClienteGrupo`,
       type: 'POST',
       data: data,
       cache: false,
       contentType: false,
       processData: false,
   success: function (data, textStatus, jqXHR) {
    console.log(data);
    $('#info-grupoTable').DataTable().row($(`#info-grupoTable tbody .delete-record${id}`).parents('tr')).remove().draw();
    let restaCount = parseInt($('#resultados_info-grupo').text()) -1;
    $('#resultados_info-grupo').text(restaCount);
    Swal.fire(
      'Borrado!',
      'Grupo borrado con éxito.',
      'success'
    )
   },
   error: function (jqXHR, textStatus) {
     console.log('error:' + jqXHR)
   }
 })
 
}
function changeStatus(id, currentS,rowNum) {
  var cell = $(`.S${id}`).closest("td");
  let newS = false;
  if (currentS === 'false') {
    newS = true;
  }
  if (currentS === 'true') {
    newS = false;
  }
  
  const data = new FormData();
     data.append("idUser", id);
     data.append("currentS", currentS);
     data.append("newS", newS);
 Swal.fire({
   title: 'Are you sure?',
   text: `Are you sure do you want change the Status ${statusObj[currentS].title} to ${statusObj[newS].title}?`,
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, change it!'
 }).then((result) => {
   if (result.isConfirmed) {
     $.ajax({
       url: `/changegrupostatus`,
       type: 'POST',
       data: data,
       cache: false,
       contentType: false,
       processData: false,
   success: function (data, textStatus, jqXHR) {
     
     if (data.rest.error) {
      swal.fire(data.rest.error);
      return;
     }
    $('.user-list-table').DataTable().row(rowNum).cell(cell).data(`${newS}`).draw();
   },
   error: function (jqXHR, textStatus) {
     console.log('error:' + jqXHR)
   }
 });
 
   }
 })

}

async function nextPage(data,currentP) {
  let responseData = await fetch(`/getgruposRegularNextPage/${data}`)
    .then((response) => response.json())
    .then((data) => {
      return data.grupos;
    });   
    console.log(responseData);
    paginacion = responseData[responseData.length-1];
      console.log(paginacion);
      responseData.pop();
      console.log(responseData);
  for (let i = 0; i < responseData.length ; i++) {
    dtgruposTable.DataTable().row.add(responseData[i])
  }    
dtgruposTable.DataTable().draw(false)

}
$('#buscador').on('keyup', function () {
  let valor = this.value
  if (dtgruposTable.DataTable().column(0).search() !== valor) {

    dtgruposTable.DataTable().column(0).search(valor).draw();
  }else{
    dtgruposTable.DataTable().column(0).search(valor).draw();
    
  }
});


$('#btnAddClienteGrupo').click(async function () {
  let fkIdUsuarioInfo = $('#fkIdUsuarioInfo').val();
  let fkIdGrupo = $('#fkIdGrupo').val()
  let name = $('#nombreGrupoDetalles').text();
  console.log(fkIdUsuarioInfo);   
  let saveInfo=await fetch("/saveUsuariosGrupos/"+fkIdUsuarioInfo+"/"+fkIdGrupo)
  .then((response) => response.json())
  .then((data) => {
    return data.response0;
  });
  console.log(saveInfo);  
  let sumaCount = parseInt($('#resultados_info-grupo').text()) +1;
  $('#resultados_info-grupo').text(sumaCount);
  $('#info-grupoTable').DataTable().row.add(saveInfo[0]).draw();
});

$('#buscadorGrupos2').on('keyup change', function(){
  console.log(this.value)
  $('#info-grupoTable').DataTable().search(this.value).draw();   
});
