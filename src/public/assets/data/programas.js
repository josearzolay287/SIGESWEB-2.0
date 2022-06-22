/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var programas, activeprogramas = 0, Inactiveprogramas = 0, paginacion = [], ejercicios = JSON.parse(document.querySelector('#ejercicios').value);
var dtprogramasTable = $('#programas-Table'),
  newprogramasidebar = $('.new-user-modal'),
  newUserForm = $('.add-new-user'),
  editUserForm = $('.edit-user-form'),
  select = $('.select2'),
  statusObj = {
    0: { title: 'Deshabilitado', class: 'badge-light-danger' },
    1: { title: 'Habilitado', class: 'badge-light-success' },
    2: { title: 'Repetido', class: 'badge-light-warning' },
    3: { title: 'Otro', class: 'badge-light-warning' }
  };
async function getprogramas() {
  programas = await fetch("/getProgramasGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.programasList;
    });
  console.log(dtprogramasTable);
  createTable();
}
function createTable() {
  // programas List datatable
  if (dtprogramasTable.length) {
    dtprogramasTable.DataTable({
      data: programas,
      columns: [
        // columns according to JSON
        { data: 'titulo' },
        //{ data: 'estado' },
        //{ data: 'createAt' },
        { data: '' }
      ],
      columnDefs: [

        /*{// User Status target 3
          targets: 1,className:'status',
          render: function (data, type, full, meta) {          
            var status = 1;///parseInt(data);          
            if (status == "undefined" || status == null || status > 3) {    
              console.log(status)       
              status=0;
            }
            return (`<span class="badge rounded-pill ${statusObj[status].class} text-capitalize" style="cursor:pointer;" onclick="changeStatus('', '${data}','${meta.row}')">${statusObj[status].title}</span>`
            );
          }
        },*/
        // {// User TOTP target 4
        //   targets: 2,
        //   render: function (data, type, full, meta) {
        //     let fecha = moment(data).format('DD/MM/YYYY')
        //     return (`<span class="badge bg-info text-capitalize">${fecha}</span>`
        //     );
        //   }
        // },
        {// Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              ` <div class="d-flex align-items-center col-actions">
              <a href="#" class="me-1" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Editar" onclick="editPrograma(${full.pkIdPrograma})">
              ${feather.icons['edit-3'].toSvg({ class: 'font-small-4', 'data-bs-toggle': "modal", 'data-bs-target': "#add-new-programa" })}
              </a>
              <a class="" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Eliminar" aria-label="Eliminar" onclick="eliminarPrograma(${full.pkIdPrograma})">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash font-small-4 me-50">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </a>
          </div>`
            );
          }
        }
      ],
      order: [[0, 'asc']],
      dom:
        '<"d-flex justify-content-between align-items-center header-actions mx-1 row mb-75"' +
        '<"col-sm-12 col-lg-4 p-0 d-flex justify-content-center justify-content-lg-start" l>' +
        '<"col-sm-12 col-lg-8 p-0"<"dt-action-buttons d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>B>>' +
        '>t' +
        '<"d-flex justify-content-between mx-2 row mb-1"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: 'Mostrar _MENU_',
        search: '',
        searchPlaceholder: 'Buscar',
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
      },
    });
    $('#programas-Table_filter input').removeClass('form-control-sm')

  }

}

$(function () {
  ('use strict');
  getprogramas();
  ejercicios.forEach(item => {
    li = `
        <li class="list-group-item"><span class="handle me-50 grabItem" data-id="${item.pkIdEjercicio}">+</span>${item.nombre}</li>
      `;

      $('#handle-list-1').append(li);
  });
});

$('#buscardorEjercicios').on('keyup', function (e) {
  let valor = this.value;
  $('#handle-list-1').empty();
  let li = "";
  for (let i = 0; i < ejercicios.length; i++) {
    if (ejercicios[i]['nombre'].toLowerCase().indexOf(valor.toLowerCase()) > -1) {
      li = `
        <li class="list-group-item"><span class="handle me-50 grabItem" data-id="${ejercicios[i].pkIdEjercicio}">+</span>${ejercicios[i].nombre}</li>
      `;

      $('#handle-list-1').append(li);
    }
  }
});

$('#categoriasPrograma').on('change', function (e) {
  let valor = this.value;
  let filterEjer = ejercicios.filter(element => element.fkIdCategoria == valor)
  $('#handle-list-1').empty();
  let li = "";
  console.log(filterEjer);
  if (valor == 0) {
    filterEjer = ejercicios;
  }
  for (let i = 0; i < filterEjer.length; i++) {
    li = `
      <li class="list-group-item"><span class="handle me-50 grabItem" data-id="${ejercicios[i].pkIdEjercicio}">+</span>${ejercicios[i].nombre}</li>
    `;

    $('#handle-list-1').append(li);
  }
});

let press = false
$('#add-new-programa .modal-body').on('mousedown', function (e) {
  press = true
  let target = e.target;

  if (e.target.classList.contains('grabItem')) {
    let idEjercicio = e.target.getAttribute('data-id');
    let ejercicioFilter = ejercicios.filter(element => element.pkIdEjercicio == idEjercicio)
    console.log(ejercicioFilter);
    let linkPers = ejercicioFilter[0].link ? `<p style="cursor: pointer;" id="link${ejercicioFilter[0].pkIdEjercicio}">{${ejercicioFilter[0].link}}</p>` : ""
    //let descPers = ejercicioFilter[0].descripcion ? `<p id="desc${ejercicioFilter[0].pkIdEjercicio}">${ejercicioFilter[0].descripcion}</p>` : ""

    let info = `<h2 class="rowExercise text-primary fw-bolder" id="e${ejercicioFilter[0].pkIdEjercicio}">${ejercicioFilter[0].nombre}</h2>${linkPers}<p>================================</p>`;

    let content = $('#editor1 .ql-editor .rowExercise');
    let timeout = setTimeout(() => {
      if (content.length) {
        $('#editor1 .ql-editor').append(info);
      } else {
        $('#editor1 .ql-editor').html(info);
      }

      // * HTML EJERCICIOSR
      $('#textarea').val($('#editor1 .ql-editor').html());

      mostrarCategorias(ejercicioFilter[0].categoria);
      clearTimeout(timeout);
    }, 1000);

  }
});

function mostrarCategorias(text) {
  let badges = document.querySelectorAll('#infoCategorias .badge')

  if (badges.length) {
    let result;
    for (let i = 0; i < badges.length; i++) {
      if (badges[i].innerText == text) {
        result = badges[i]
      }
    }

    if (!result) {
      let newBadge = `<span class="badge badge-light-secondary me-1">${text}</span>`
      $('#infoCategorias').append(newBadge)
    }

  } else {
    let newBadge = `<span class="badge badge-light-secondary me-1">${text}</span>`
    $('#infoCategorias').append(newBadge)

  }
}

function eliminarPrograma(id) {
  const data = new FormData();
  data.append("id", id);
  Swal.fire({
    title: 'Deseas eliminar este programa?',
    text: "Esta acción no se podrá revertir!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#007EA8',
    cancelButtonColor: '#82868b',
    confirmButtonText: '&nbsp;&nbsp;&nbsp; Si &nbsp;&nbsp;&nbsp;',
    cancelButtonText: '&nbsp;&nbsp;&nbsp; No &nbsp;&nbsp;&nbsp;'

  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/deleteProgramaGlobal`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {
          let status = data;

          if (status != "error") {
            $('#programas-Table').dataTable().fnDestroy();
            $('#programas-Table').empty();
            $('#programas-Table').html(`
              <thead>
              <tr role="row">
              <th class="sorting" tabindex="0" rowspan="1" colspan="1" style="width: 270px;" >Nombre</th>
              <th class="cell-fit sorting_disabled" rowspan="1" colspan="1" style="width: 80px;">Acciones</th>
              </tr>
              </thead>`);
            getprogramas();
  
            Swal.fire({
              title: 'Programa Eliminado!',
              text: 'El programa fue eliminado exitosamente.',
              icon: 'success'
            });
            return
          }

          Swal.fire({
            title: 'Estimado Usuario!',
            text: 'Se presento un problema al realizar la acción.',
            icon: 'error'
          });
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
    }
  });
}

function editPrograma(id) {
  $('#idPrograma').val(id);
  let filterProgram = programas.filter(item => item.pkIdPrograma == id);
  console.log(filterProgram)
  $('#tituloPrograma').val(filterProgram[0].titulo);
  $('#editor1 .ql-editor').html(filterProgram[0].descripcion);
  $('#textarea').val(filterProgram[0].descripcion);
  detectarEjercicios()
}

$('#editor1 .ql-editor').on('keyup', function () {
  detectarEjercicios()
  
});


function detectarEjercicios(e) {
  $('.rowExercise').each(function (index, element) {
    let item = element.getAttribute('id')
    
  });
}

$('#programaForm').submit(function (e) {
  e.preventDefault();
  let url = "addProgramaGlobal",
    id = $('#idPrograma').val(),
    titulo = $('#tituloPrograma').val(),
    descripcion = $('#textarea').val($('#editor1 .ql-editor').html());
  let edit = false;

  if (id) {
    url = "editProgramaGlobal"
    edit = true;
  }

  if (titulo && descripcion) {
    $.ajax({
      url: `/${url}`,
      type: 'POST',
      data: $(this).serialize(),
      success: async function (data, textStatus, jqXHR) {
        $('#programas-Table').dataTable().fnDestroy();
        $('#programas-Table').empty();
        $('#programas-Table').html(`
                <thead>
                  <tr role="row">
                      <th class="sorting" tabindex="0" rowspan="1" colspan="1" style="width: 270px;" >Nombre</th>
                      <th class="cell-fit sorting_disabled" rowspan="1" colspan="1" style="width: 80px;">Acciones</th>
                  </tr>
                </thead>`);
        getprogramas();
        $('#programaForm').trigger('reset');
        $('#editor1 .ql-editor').html('<p>Empieza a crear tu Programa Aquí</p>');
        $('#add-new-programa .btn-close').click()
        if (edit) {
          Swal.fire({
            icon: 'success',
            title: 'Programa Actualizado!',
            text: 'Se ha actualizado el programa exitosamente.',
          });

        } else {
          Swal.fire({
            icon: 'success',
            title: 'Programa Registrado!',
            text: 'Se ha creado el programa exitosamente.',
          });
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
        console.log('error:' + textStatus)
      }
    });
  } else {
    if (!descripcion) {
      $('#msjEditor').removeClass('d-none');
      let timeout = setTimeout(() => {
        $('#msjEditor').addClass('d-none');
        clearTimeout(timeout)
      }, 3000);
    }
  }
});

$('#add-new-programa').on('hidden.bs.modal', () => {
  $('#programaForm').trigger('reset');
  $('#editor1 .ql-editor').html('<p>Empieza a crear tu Programa Aquí</p>');
});
