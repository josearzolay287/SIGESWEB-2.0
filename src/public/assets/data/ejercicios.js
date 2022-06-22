/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var ejercicios, activeejercicios = 0, Inactiveejercicios = 0, paginacion = [];
var dtejerciciosTable = $('#ejerciciosTable'),
  editEjercicioForm = $('#editEjercicioForm');
async function getejercicios() {
  ejercicios = await fetch("/getEjerciciosGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.EjercisiosData;
    });
  console.log(ejercicios);
}

$(function () {
  ('use strict');
  // Form Validation
  getejercicios()
 

});
if (editEjercicioForm.length) {
  editEjercicioForm.validate({
    errorClass: 'error',
    rules: {
      'nombreEjercicio': {
        required: true
      },
      'categoriaEjercicio': {
        required: true
      },
    }
  });

  editEjercicioForm.on('submit', function (e) {
    var isValid = editEjercicioForm.valid();
    $("#hiddenAreaedit").val($("#editor2 .ql-editor").html());
    e.preventDefault();
    let url = "saveEditedEjercicio";
    if ($('#pkIdEjercicio').val() == "") {
      url = "saveEjercicio";
    }
    if (isValid) {
      $.ajax({
        url: `/${url}`,
        type: 'POST',
        data: editEjercicioForm.serialize(),
        success: async function (data, textStatus, jqXHR) {
          console.log(data)
          let formData = editEjercicioForm.serializeArray();
          console.log(formData)
          let categoria = $("#categoriaEjercicioEdit option:selected").text()
          if (data.updateEjercicio) {
            swal.fire("Ejercicio editado con éxito");
          }
          if (data.createEjercicio) {
            swal.fire("Ejercicio creado con éxito");
            let tab = `<a class="list-group-item list-group-item-action d-flex justify-content-between"
           id="list-home-list${data.createEjercicio[0]}" data-bs-toggle="list"
           href="#ejercicio${data.createEjercicio[0]}" role="tab"
           aria-controls="${data.createEjercicio[0]}">${formData[1]['value']}
           <div class="box">
              <span href="#" class="text-primary editEjercicio" id="${data.createEjercicio[0]}" onclick="editEjercicio('${data.createEjercicio[0]}')">
                ${feather.icons['edit-3'].toSvg({ class: 'font-medium-3 editEjercicio', onclick: `editEjercicio('${data.createEjercicio[0]}')` })}
              </span>
              <span href="#" class="text-primary ms-50" onclick="deleteEjercicio('${data.createEjercicio[0]}')">
                ${feather.icons['trash'].toSvg({ class: 'font-medium-3' })}
              </span>
            </div>
       </a>`;
            let content = `<div class="tab-pane fade show"
           id="ejercicio${data.createEjercicio[0]}" role="tabpanel"
           aria-labelledby="list-home-list">
           <h4 class="card-title">${formData[1]['value']}</h4>

           <p class="card-text">
               Categoría: ${categoria}
               <br>
               Link: ${formData[3]['value']}
           <p style="text-align: justify;">Descripción:
           ${formData[4]['value']}                 
           </p>
       </div>`;
            $('#list-tab').append(tab);
            $('#nav-tabContent').append(content);
            let count = parseInt($('#counEjercicios').text())+ 1
            $('#counEjercicios').text(count);
            ejercicios = await fetch("/getEjerciciosGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.EjercisiosData;
    });
          }

          $('#create-edit-ejercicio').modal('hide');
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });

    }
  });
}
async function deleteEjercicio(id) {
  const data = new FormData();
  data.append("pkIdEjercicio", id);
  Swal.fire({
    title: 'Seguró desea eliminar?',
    text: "Seguro desea eliminar el ejercicio, luego no se podrá revertir la operación",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/deleteEjercicio`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success:async  function (data, textStatus, jqXHR) {

          $(`#list-home-list${id}`).remove();
          $(`#ejercicio${id}`).remove();
          let count = parseInt($('#counEjercicios').text())- 1
            $('#counEjercicios').text(count);
          Swal.fire(
            'Borrado!',
            'Ejercicio borrado con éxito.',
            'success'
          )
          ejercicios = await fetch("/getEjerciciosGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.EjercisiosData;
    });
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });

    }
  })



}

function editEjercicio(id) {
  console.log(id)
  console.log(ejercicios)
  let ejercicioEdit = ejercicios.filter(element => element['pkIdEjercicio'] == id)
  console.log(ejercicioEdit);

  $('#pkIdEjercicio').val(ejercicioEdit[0].pkIdEjercicio);
  $('#nombreEjercicioEdit').val(ejercicioEdit[0].nombre);
  $('#categoriaEjercicioEdit').val(ejercicioEdit[0].fkIdCategoria).trigger('change');
  $('#linkEjercicioEdit').val(ejercicioEdit[0].link);
  $('#editor2 .ql-editor ').html(ejercicioEdit[0].descripcion);
  $('#hiddenAreaedit').val(ejercicioEdit[0].descripcion);
  $('#create-edit-ejercicio').modal('show')
}

$('#list-tab .editEjercicio').on('click', function () {
  console.log($(this))
  console.log($(this)[0].id)
  editEjercicio($(this)[0].id)
})
$('#create-edit-ejercicio').on('hidden.bs.modal', function () {
  editEjercicioForm[0].reset();
  $('#editor2 .ql-editor ').html('');
});
$('#buscador').on('keyup', function (e) {
  let valor = this.value;  
$('#list-tab').empty();
$('#nav-tabContent').empty();
let tab, content, active;
for (let i = 0; i < ejercicios.length; i++) {
  if (ejercicios[i]['nombre'].toLowerCase().indexOf(valor.toLowerCase()) > -1) {
    tab = `<a class="list-group-item list-group-item-action d-flex justify-content-between"
    id="list-home-list${ejercicios[i]['pkIdEjercicio']}" data-bs-toggle="list"
    href="#ejercicio${ejercicios[i]['pkIdEjercicio']}" >${ejercicios[i]['nombre']}
    <div class="box">
       <span href="#" class="text-primary editEjercicio" id="${ejercicios[i]['pkIdEjercicio']}" onclick="editEjercicio('${ejercicios[i]['pkIdEjercicio']}')">
         ${feather.icons['edit-3'].toSvg({ class: 'font-medium-3 editEjercicio', onclick: `editEjercicio('${ejercicios[i]['pkIdEjercicio']}')` })}
       </span>
       <span href="#" class="text-primary ms-50" onclick="deleteEjercicio('${ejercicios[i]['pkIdEjercicio']}')">
         ${feather.icons['trash'].toSvg({ class: 'font-medium-3' })}
       </span>
     </div>
  </a>`;
      content = `<div class="tab-pane fade show"
    id="ejercicio${ejercicios[i]['pkIdEjercicio']}" role="tabpanel"
    aria-labelledby="list-home-list">
    <h4 class="card-title">${ejercicios[i]['nombre']}</h4>
  
    <p class="card-text">
        Categoría: ${ejercicios[i]['categoria']}
        <br>
        Link: ${ejercicios[i]['nombre']}
    <p style="text-align: justify;">Descripción:
    ${ejercicios[i]['nombre']}                 
    </p>
  </div>`;
  $('#list-tab').append(tab);
   $('#nav-tabContent').append(content);
}
}

});
$('#categoriaSlect').on('change', function (e) {
  let valor = this.value;  
  let filterEjer= ejercicios.filter(element => element.fkIdCategoria == valor)
$('#list-tab').empty();
$('#nav-tabContent').empty();
let tab, content, active;
console.log(filterEjer);
if (valor == 0) {
  filterEjer = ejercicios;
}
for (let i = 0; i < filterEjer.length; i++) {
    tab = `<a class="list-group-item list-group-item-action d-flex justify-content-between"
    id="list-home-list${filterEjer[i]['pkIdEjercicio']}" data-bs-toggle="list"
    href="#ejercicio${filterEjer[i]['pkIdEjercicio']}" >${filterEjer[i]['nombre']}
    <div class="box">
       <span href="#" class="text-primary editEjercicio" id="${filterEjer[i]['pkIdEjercicio']}" onclick="editEjercicio('${filterEjer[i]['pkIdEjercicio']}')">
         ${feather.icons['edit-3'].toSvg({ class: 'font-medium-3 editEjercicio', onclick: `editEjercicio('${filterEjer[i]['pkIdEjercicio']}')` })}
       </span>
       <span href="#" class="text-primary ms-50" onclick="deleteEjercicio('${filterEjer[i]['pkIdEjercicio']}')">
         ${feather.icons['trash'].toSvg({ class: 'font-medium-3' })}
       </span>
     </div>
  </a>`;
      content = `<div class="tab-pane fade show"
    id="ejercicio${filterEjer[i]['pkIdEjercicio']}" role="tabpanel"
    aria-labelledby="list-home-list">
    <h4 class="card-title">${filterEjer[i]['nombre']}</h4>
  
    <p class="card-text">
        Categoría: ${filterEjer[i]['categoria']}
        <br>
        Link: ${filterEjer[i]['nombre']}
    <p style="text-align: justify;">Descripción:
    ${filterEjer[i]['nombre']}                 
    </p>
  </div>`;
  $('#list-tab').append(tab);
   $('#nav-tabContent').append(content);
}

});