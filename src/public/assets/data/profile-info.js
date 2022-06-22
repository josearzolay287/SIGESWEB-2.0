/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var profileInf, activeprofileInf = 0,InactiveprofileInf=0, paginacion = [],formArrayMedidas,plAbdominal,plSuprailiaco,plTriceps,plSubescapular,plPectoral,plAxilar,plPantorrilla,prSistole,prDiastole,prPulso;
var nutricion;
var basicPickr = $('.flatpickr-basic')
var DtTableGeneralMedidas = $('#TableGeneralMedidas'),newprofileInfidebar = $('.new-user-modal'),addNewMedida = $('#addNewMedida'),rangePickrMedida = $('#medidaFilterFechaRange'),clientesForm = $('#formClienteInfo'),formPlanEntrenamiento = $('#formPlanEntrenamiento'),formChangePassword = $('#formChangePassword');
var ejercicios, programas;


async function getejercicios() {
  ejercicios = await fetch("/getEjerciciosGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.EjercisiosData;
    });
  console.log(ejercicios);
  getprogramasGlobal ()
}
async function getprogramasGlobal (){
  programas=await fetch("/getprogramasGlobal")
       .then((response) => response.json())
       .then((data) => {
         return data.programasList;
       });
     console.log(programas);  
       programas.forEach(element => {
         $('#programasGlobales').append(`<option value="${element.pkIdPrograma}">${element.titulo}</option>`)
       });

       
 }
$(function () {
  ('use strict');
  getejercicios()
  if (rangePickrMedida.length) {
    rangePickrMedida.flatpickr({
      mode: 'range'
    });
    rangePickrMedida.on('change',function () {
      console.log(($(this).val()).replace(/\s+/g, ''))
      let value =  ($(this).val()).replace(/\s+/g, '')
      let array = value.split('to');
      console.log(array)
     
            if (array.length == 2) {
               var nColumnas = $("#TableGeneralMedidas tr:last td").length;
            console.log(nColumnas);
            if (nColumnas > 1) {
              for (let i = 2; i <= nColumnas +1; i++) {              
              $(`#TableGeneralMedidas td:last-child,#TableGeneralMedidas th:last-child`).remove();
     $('#TableMeMedidas td:last-child,#TableMeMedidas th:last-child').remove();
     $('#TablePlieguesMedidas td:last-child,#TablePlieguesMedidas th:last-child').remove();
     $('#TablePrArMedidas td:last-child,#TablePrArMedidas th:last-child').remove();
            }
            }
            
            const data_C = new FormData();
            data_C.append("fechaIni", array[0]);
            data_C.append("fechaFin", array[1]);
            data_C.append("fkIdUsuario", $('#fkIdUsuario').val());
            $.ajax({
              url: `/MedidasEntreDosFechas`,
              type: 'POST',
              data: data_C,
              cache: false,
              contentType: false,
              processData: false,
              success: async function (data, textStatus, jqXHR) {
                console.log(data.medidas)
                for (let i = 0; i < data.medidas.length; i++) {
                  console.log(Object.values(data.medidas[i]))
                  AgregaColumnasMedidasFilterFecha(data.medidas[i])
                }
              },
              error: function (jqXHR, textStatus) {
                console.log('error:' + jqXHR)
              }
            });
            
            }
            
    })
  }
  if (addNewMedida.length) {
    addNewMedida.validate({
      errorClass: 'error',
      rules: {
        'geAltura': {
          required: true
        },
        'creado': {
          required: true
        },
      }
    });
  
    addNewMedida.on('submit', function (e) {
      var isValid = addNewMedida.valid();
      e.preventDefault();
      let url = "createNewEditMedida",
fkIdUsuario = $('#fkIdUsuario').val();
plAbdominal = $('#plAbdominal').val()
plSuprailiaco = $('#plSuprailiaco').val()
plTriceps = $('#plTriceps').val()
plSubescapular = $('#plSubescapular').val()
plPectoral = $('#plPectoral').val()
plAxilar = $('#plAxilar').val()
plPantorrilla = $('#plPantorrilla').val()
prSistole = $('#prSistole').val()
prDiastole = $('#prDiastole').val()
prPulso = $('#prPulso').val()
pkIdMedidas = $('#pkIdMedidas').val();
console.log(pkIdMedidas)
formArrayMedidas = addNewMedida.serializeArray()
console.log(formArrayMedidas);
      if (isValid) {
        $.ajax({
          url: `/${url}`,
          type: 'POST',
          data: addNewMedida.serialize(),
          success: async function (data, textStatus, jqXHR) {
            console.log(data)
            if (data.existe) {
              swal.fire('Error',`La fecha: ${formArrayMedidas[0]['value']}, ya cuenta con medidas`, 'warning');
              return
            } 
            if (data.type == 'update') {
                console.log( $('#rowIndex').val());
                ActualizaMedidasEdited($('#rowIndex').val())
              $('#medidas-modal').modal('hide');
              swal.fire('Guardado con éxito',`Se actualizaron las medidas en la fecha: ${formArrayMedidas[2]['value']}, con éxito`, 'success');
              return
            }           
            var nColumnas = $("#TableGeneralMedidas tr:last td").length;
            console.log(nColumnas);
            if (nColumnas == 11) {
     $('#TableGeneralMedidas td:nth-child(11),#TableGeneralMedidas th:nth-child(11)').remove();
    $('#TableMeMedidas td:nth-child(11),#TableMeMedidas th:nth-child(11)').remove();
    $('#TablePlieguesMedidas td:nth-child(11),#TablePlieguesMedidas th:nth-child(11)').remove();
    $('#TablePrArMedidas td:nth-child(11),#TablePrArMedidas th:nth-child(11)').remove();
            }
            AgregaColumnasMedidas()
            
swal.fire('Guardado con éxito',`Se guardaron las medidas en la fecha: ${formArrayMedidas[2]['value']}, con éxito`, 'success');
            $('#medidas-modal').modal('hide');
          },
          error: function (jqXHR, textStatus) {
            console.log('error:' + jqXHR)
          }
        });
  
      }
    });
  }
  
  getNutricion();

    // Default
    if (basicPickr.length) {
      basicPickr.flatpickr({changeMonth: true,
        changeYear: true,});
    }

  if (formChangePassword.length) {
    formChangePassword.validate({
      errorClass: 'error',
      rules: {
        'newPassword': {
          required: true
        },
        'confirmPassword': {
          required: true
        },
      }
    });
  
    formChangePassword.on('submit', function (e) {
      var isValid = formChangePassword.valid();
      e.preventDefault();   
      if ($('#newPassword').val() !== $('#confirmPassword').val()) {
        swal.fire('Revisar',`Su password y confirmacion no son iguales,corregir`, 'warning');

        return
      }   
      if (isValid) {
        $.ajax({
          url: `/changePassword`,
          type: 'POST',
          data: formChangePassword.serialize()+`&pkIdUsuario=${$('#idEditCliente').val()}`,
          success: async function (data, textStatus, jqXHR) {
            console.log(data)
            if (data.saveNewPassword[0] == 0) {
              swal.fire('Observación',`Su password actual y el nuevo ingreso son los mismos`, 'warning');
              return
            }            
        swal.fire('Guardado con éxito',`Se guardó con éxito su nueva clave`, 'success');
          },
          error: function (jqXHR, textStatus) {
            console.log('error:' + jqXHR)
          }
        });
  
      }
    });
  }


});

/**OUT DOCUMENT READY */
$('#btnSaveMedidas').click(()=>{
  addNewMedida.submit();
})

$('#medidas-modal').on('show.bs.modal',()=>{
$('#addMedidasAccordion_Medidas').addClass('d-none');
$('#addMedidasAccordion_Pliegues').addClass('d-none');
$('#addMedidasAccordion_PrAr').addClass('d-none');
if ($('#checkMedidasSeccion').is(':checked')) {
  $('#addMedidasAccordion_Medidas').removeClass('d-none');
}
if ($('#checkPlieguesSeccion').is(':checked')) {
  $('#addMedidasAccordion_Pliegues').removeClass('d-none');
}
if ($('#checkPrArSeccion').is(':checked')) {
 $('#addMedidasAccordion_PrAr').removeClass('d-none'); 
}
})


$('#checkMedidasSeccion').change(function () {
  if ($('#checkMedidasSeccion').is(':checked')) {
    $('#accordionTabla_Medidas').removeClass('d-none');
  }else{
    $('#accordionTabla_Medidas').addClass('d-none');
  }
})
$('#checkPlieguesSeccion').change(function () {
  if ($('#checkPlieguesSeccion').is(':checked')) {
    $('#accordionTabla_Pliegues').removeClass('d-none');
  }else{
    $('#accordionTabla_Pliegues').addClass('d-none');
  }
})
$('#checkPrArSeccion').change(function () {
  if ($('#checkPrArSeccion').is(':checked')) {
    $('#accordionTabla_PrAr').removeClass('d-none'); 
   }else{
    $('#accordionTabla_PrAr').addClass('d-none');
  }
});

function AgregaColumnasMedidas() {
  console.log(formArrayMedidas)
  $('#trFechaGeneral th:first').after(` <th
  class="position-relative text-center bg-transparent">
  <div class="dropdown position-absolute end-0">
      <button type="button"
          class="btn btn-sm dropdown-toggle hide-arrow p-0"
          data-bs-toggle="dropdown">
          ${feather.icons['more-vertical'].toSvg()}
      </button>
      <div
          class="dropdown-menu dropdown-menu-end">
          <a class="dropdown-item text-primary"
              href="#">
              ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
              <span class="text-capitalize">Fijar</span>
          </a>
          <a class="dropdown-item" href="#" onclick="editarMedidaF('${formArrayMedidas[2]['value']}',this)">
          ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
              <span
                  class="text-capitalize">Editar</span>
          </a>
          <a class="dropdown-item" href="#" onclick="deleteMedidaF('${formArrayMedidas[2]['value']}', this)">
          ${feather.icons['trash'].toSvg({class: 'me-50'})}
              <span
                  class="text-capitalize">Eliminar</span>
          </a>
      </div>
  </div>
  <div class="text-primary">${moment(formArrayMedidas[2]['value']).format('DD/MM')}</div>
</th>`)
$('#trFechaMedidasM th:first').after(` <th
class="position-relative text-center bg-transparent">
<div class="dropdown position-absolute end-0">
    <button type="button"
        class="btn btn-sm dropdown-toggle hide-arrow p-0"
        data-bs-toggle="dropdown">
        ${feather.icons['more-vertical'].toSvg()}
    </button>
    <div
        class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item text-primary"
            href="#">
            ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
            <span class="text-capitalize">Fijar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="editarMedidaF('${formArrayMedidas[2]['value']}',this)">
        ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Editar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="deleteMedidaF('${formArrayMedidas[2]['value']}', this)">
        ${feather.icons['trash'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Eliminar</span>
        </a>
    </div>
</div>
<div class="text-primary">${moment(formArrayMedidas[2]['value']).format('DD/MM')}</div>
</th>`)
$('#trFechaPliegues th:first').after(` <th
class="position-relative text-center bg-transparent">
<div class="dropdown position-absolute end-0">
    <button type="button"
        class="btn btn-sm dropdown-toggle hide-arrow p-0"
        data-bs-toggle="dropdown">
        ${feather.icons['more-vertical'].toSvg()}
    </button>
    <div
        class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item text-primary"
            href="#">
            ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
            <span class="text-capitalize">Fijar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="editarMedidaF('${formArrayMedidas[2]['value']}',this)">
        ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Editar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="deleteMedidaF('${formArrayMedidas[2]['value']}', this)">
        ${feather.icons['trash'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Eliminar</span>
        </a>
    </div>
</div>
<div class="text-primary">${moment(formArrayMedidas[2]['value']).format('DD/MM')}</div>
</th>`)
$('#trFechaPrAr th:first').after(` <th
class="position-relative text-center bg-transparent">
<div class="dropdown position-absolute end-0">
    <button type="button"
        class="btn btn-sm dropdown-toggle hide-arrow p-0"
        data-bs-toggle="dropdown">
        ${feather.icons['more-vertical'].toSvg()}
    </button>
    <div
        class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item text-primary"
            href="#">
            ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
            <span class="text-capitalize">Fijar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="editarMedidaF('${formArrayMedidas[2]['value']}',this)">
        ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Editar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="deleteMedidaF('${formArrayMedidas[2]['value']}', this)">
        ${feather.icons['trash'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Eliminar</span>
        </a>
    </div>
</div>
<div class="text-primary">${moment(formArrayMedidas[2]['value']).format('DD/MM')}</div>
</th>`)
for (let i = 1; i < 33 ; i++) {
  $(`#trM${i} th:first`).after(`<td class="text-center text-primary fw-bolder">
  <div class="fw-bolder cursor-pointer"onclick="graficar('${i}')">${formArrayMedidas[i+2]['value']}</div>  </td>`)
}
}

function AgregaColumnasMedidasFilterFecha(array) {
  console.log(Object.values(array))
  array = Object.values(array)
  $('#trFechaGeneral th:first').after(` <th
  class="position-relative text-center bg-transparent">
  <div class="dropdown position-absolute end-0">
      <button type="button"
          class="btn btn-sm dropdown-toggle hide-arrow p-0"
          data-bs-toggle="dropdown">
          ${feather.icons['more-vertical'].toSvg()}
      </button>
      <div
          class="dropdown-menu dropdown-menu-end">
          <a class="dropdown-item text-primary" href="#">
              ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
              <span class="text-capitalize">Fijar</span>
          </a>
          <a class="dropdown-item" href="#" onclick="editarMedidaF('${array[0]}',this)">
          ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
              <span
                  class="text-capitalize">Editar</span>
          </a>
          <a class="dropdown-item" href="#" onclick="deleteMedidaF('${array[0]}', this)">
          ${feather.icons['trash'].toSvg({class: 'me-50'})}
              <span
                  class="text-capitalize">Eliminar</span>
          </a>
      </div>
  </div>
  <div class="text-primary">${moment(array[0]).format('DD/MM')}</div>
</th>`)
$('#trFechaMedidasM th:first').after(` <th
class="position-relative text-center bg-transparent">
<div class="dropdown position-absolute end-0">
    <button type="button"
        class="btn btn-sm dropdown-toggle hide-arrow p-0"
        data-bs-toggle="dropdown">
        ${feather.icons['more-vertical'].toSvg()}
    </button>
    <div
        class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item text-primary"
            href="#">
            ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
            <span class="text-capitalize">Fijar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="editarMedidaF('${array[0]}',this)">
        ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Editar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="deleteMedidaF('${array[0]}', this)">
        ${feather.icons['trash'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Eliminar</span>
        </a>
    </div>
</div>
<div class="text-primary">${moment(array[0]).format('DD/MM')}</div>
</th>`)
$('#trFechaPliegues th:first').after(` <th
class="position-relative text-center bg-transparent">
<div class="dropdown position-absolute end-0">
    <button type="button"
        class="btn btn-sm dropdown-toggle hide-arrow p-0"
        data-bs-toggle="dropdown">
        ${feather.icons['more-vertical'].toSvg()}
    </button>
    <div
        class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item text-primary"
            href="#">
            ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
            <span class="text-capitalize">Fijar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="editarMedidaF('${array[0]}',this)">
        ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Editar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="deleteMedidaF('${array[0]}', this)">
        ${feather.icons['trash'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Eliminar</span>
        </a>
    </div>
</div>
<div class="text-primary">${moment(array[0]).format('DD/MM')}</div>
</th>`)
$('#trFechaPrAr th:first').after(` <th
class="position-relative text-center bg-transparent">
<div class="dropdown position-absolute end-0">
    <button type="button"
        class="btn btn-sm dropdown-toggle hide-arrow p-0"
        data-bs-toggle="dropdown">
        ${feather.icons['more-vertical'].toSvg()}
    </button>
    <div
        class="dropdown-menu dropdown-menu-end">
        <a class="dropdown-item text-primary"
            href="#">
            ${feather.icons['bookmark'].toSvg({class: 'me-50'})}
            <span class="text-capitalize">Fijar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="editarMedidaF('${array[0]}',this)">
        ${feather.icons['edit-2'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Editar</span>
        </a>
        <a class="dropdown-item" href="#" onclick="deleteMedidaF('${array[0]}', this)">
        ${feather.icons['trash'].toSvg({class: 'me-50'})}
            <span
                class="text-capitalize">Eliminar</span>
        </a>
    </div>
</div>
<div class="text-primary">${moment(array[0]).format('DD/MM')}</div>
</th>`)
for (let i = 1; i < array.length ; i++) {
  $(`#trM${i} th:first`).after(`<td class="text-center text-primary fw-bolder">
  <div class="fw-bolder cursor-pointer" onclick="graficar('${i}')">${array[i]}</div>
  </td>`)
}
}
function ActualizaMedidasEdited(index) {
  console.log(formArrayMedidas)
  console.log(index)
for (let i = 1; i < 33; i++) {
  $(`#trM${i} td:nth-child(${index})`).html(`
  <div class="fw-bolder cursor-pointer" onclick="graficar('${i}')">${formArrayMedidas[i+2]['value']}</div>`)
}
}
async function getNutricion() {
  let fkIdUsuario = $('#fkIdUsuario').val();
  nutricion = await fetch('/getNutricion/'+fkIdUsuario).then((response)=>response.json()).then((data)=>{
    return data.nutricion
  })
  let div;
  for (let i = 0; i < nutricion.length; i++) {
    div=`<div class="col-sm-12 col-md-6" id="nutricion${nutricion[i].pkIdNutricion}">
    <div class="card fade show">
        <div class="card-header">
            <div class="col-10">
                <div class="row">
                    <div class="col-6">
                        <input class="form-control " type="text" id="titulo${nutricion[i].pkIdNutricion}"
                            placeholder="Titulo" value="${nutricion[i].titulo}" />
                    </div>
                    <div class="col-6">
                        <input type="text" id="flatpickr-basic${nutricion[i].pkIdNutricion}"
                            class="form-control flatpickr-basic"
                            placeholder="YYYY-MM-DD" value="${moment(nutricion[i].creado).format('YYYY-MM-DD')}"/>
                    </div>
                </div>
            </div>
            <div class="heading-elements">
                <ul class="list-inline mb-0">
                    <li >
                        <a href="#" class="text-secondary" data-bs-toggle="tooltip" data-popup="tooltip-custom"
                        title="Guardar" onclick="guardarNutricion('${nutricion[i].pkIdNutricion}')">
                        ${feather.icons['save'].toSvg({ class: 'cursor-pointer'})}
                        </a>
                        <a href="#" class="text-secondary"  data-bs-toggle="tooltip" data-popup="tooltip-custom"
                        title="Eliminar" onclick="deleteNutricion('${nutricion[i].pkIdNutricion}')">
                        ${feather.icons['trash-2'].toSvg({ class: 'cursor-pointer'})}
                        </a>
                    </li>
                </ul>
            </div>

        </div>
        <div class="card-body">
            <div class="row">
                <div id="blog-editor${nutricion[i].pkIdNutricion}">
                ${nutricion[i].descripcion}
                </div>
                <textarea class="d-none textNota" name="nota">${nutricion[i].descripcion}</textarea>
                <button class="d-none guardarNota"></button>
                <input type="file" class="form-control mt-1">
            </div>
        </div>
    </div>

</div>`;
    $('#nutricion-list').append(div);
    setBlog(nutricion[i].pkIdNutricion);
    $(`#flatpickr-basic${nutricion[i].pkIdNutricion}`).flatpickr({changeMonth: true,
      changeYear: true,});
  }
  
}

async function guardarNutricion(pkIdNutricion) {  
  console.log(pkIdNutricion);
  let fkIdUsuario = $('#fkIdUsuario').val();
  let titulo = $(`#titulo${pkIdNutricion}`).val();
  let creado = moment($(`#flatpickr-basic${pkIdNutricion}`).val()).format("YYYY-MM-DD");
  let nota = $(`#blog-editor${pkIdNutricion} .ql-editor`).html();
  console.log(titulo);
  console.log(creado);
  console.log(nota);
  const data = new FormData();
  data.append("pkIdNutricion", pkIdNutricion);
  data.append("titulo", titulo);
  data.append("descripcion", nota);
  data.append("fkIdUsuario", fkIdUsuario);
  data.append("creado", creado);
  $.ajax({
    url: `/guardarNutricion`,
    type: 'POST',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data, textStatus, jqXHR) {
      console.log(data)
      if (data.type == 'update' && data.guardaNut[0] > 0) {
        swal.fire('Guardado',`La nota se actualizó con éxito`, 'success');
        return
      }else if (data.type == 'update' && data.guardaNut[0] == 0) {
        swal.fire('Sin cambios',`La nota no tiene ningún cambio que actualizar`, 'warning');
        return
      } else if (data.type == 'insert' && data.guardaNut[0] >0) {

        $(`#titulo0`).attr('id', 'titulo'+data.guardaNut[0]);
        $(`#nutricion0`).attr('id', 'nutricion'+data.guardaNut[0]);
        $(`#flatpickr-basic0`).attr('id', 'flatpickr-basic'+data.guardaNut[0]);
        $(`#blog-editor0`).attr('id', 'blog-editor'+data.guardaNut[0]);
        $(`#creaNutricion`).attr('onclick', `guardarNutricion('${data.guardaNut[0]}')`);
        $(`#creaNutricion`).removeAttr('id');
        swal.fire('Guardado',`La nota se creó con éxito`, 'success');
        return
      }
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });
}
async function deleteNutricion(id) {
    const data = new FormData();
    data.append("pkIdNutricion", id);
    Swal.fire({
      title: 'Seguró desea eliminar?',
      text: "Seguro desea eliminar la nota de nutrición indicada, luego no se podrá revertir la operación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/deleteNutricion`,
          type: 'POST',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          success:async  function (data, textStatus, jqXHR) {
  
            if (data.deleteNutricion == 0) {
              Swal.fire(
                'Error!',
                'Ocurrió un error intentando borrar la medida',
                'warning'
              )
              return
            }
            $(`#nutricion${id}`).remove();
            Swal.fire(
              'Borrado!',
              'Nutrición borrada con éxito.',
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

$('#agregaNutricionbtn').click(()=>{
  let div=`<div class="col-sm-12 col-md-6" id="nutricion0">
  <div class="card fade show border-primary">
      <div class="card-header">
          <div class="col-10">
              <div class="row">
                  <div class="col-6">
                      <input class="form-control " type="text" id="titulo0"
                          placeholder="Titulo" value="" />
                  </div>
                  <div class="col-6">
                      <input type="text" id="flatpickr-basic0"
                          class="form-control flatpickr-basic"
                          placeholder="YYYY-MM-DD" value=""/>
                  </div>
              </div>
          </div>
          <div class="heading-elements">
              <ul class="list-inline mb-0">
                  <li >
                      <a href="#" class="text-secondary" data-bs-toggle="tooltip" data-popup="tooltip-custom"
                      title="Guardar" onclick="guardarNutricion('0')" id="creaNutricion">
                      ${feather.icons['save'].toSvg({ class: 'cursor-pointer'})}
                      </a>
                      <a href="#" class="text-secondary"  data-bs-toggle="tooltip" data-popup="tooltip-custom"
                      title="Eliminar">
                      ${feather.icons['trash-2'].toSvg({ class: 'cursor-pointer'})}
                      </a>
                  </li>
              </ul>
          </div>

      </div>
      <div class="card-body">
          <div class="row">
              <div id="blog-editor0">
              
              </div>
              <button class="d-none guardarNota"></button>
              <input type="file" class="form-control mt-1">
          </div>
      </div>
  </div>

</div>`;
  $('#nutricion-list').prepend(div);
  setBlog(0);
  $(`#flatpickr-basic0`).flatpickr({changeMonth: true,
    changeYear: true,});
})




$('#btnEnviarCorreo').click(function (e) {
  $('#nombreCliente').text($('#nombreCliente1').text())
})

let btnAccordions = document.querySelectorAll('.accordion-button')

btnAccordions.forEach(btn => {
  btn.addEventListener('click', e => {
      ResetAccordionStyles()
      e.target.classList.add('bg-primary', 'text-white')
  })
});

function ResetAccordionStyles() {
  btnAccordions.forEach(btn => {
      btn.classList.remove('bg-primary')
      btn.classList.remove('text-white')
  });
}

var Font = Quill.import('formats/font');
Font.whitelist = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'];
Quill.register(Font, true);

var blogEditor = new Quill('#editor_plan', {
  bounds: editor_plan,
  modules: {
      formula: true,
      syntax: true,
      toolbar: [
          [
              {
                  font: []
              },
              {
                  size: []
              }
          ],
          ['bold', 'italic', 'underline', 'strike'],
          /* [
             {
               color: []
             },
             {
               background: []
             }
           ],
           [
             {
               script: 'super'
             },
             {
               script: 'sub'
             }
           ],
           [
             {
               header: '1'
             },
             {
               header: '2'
             },
             'blockquote',
             'code-block'
           ],*/
          [
              {
                  list: 'ordered'
              },
              {
                  list: 'bullet'
              },
              /* {
                 indent: '-1'
               },
               {
                 indent: '+1'
               }
             ],
             [
               'direction',
               {
                 align: []
               }*/
          ],
          ['link', 'image', 'video', 'formula'],
          ['clean']
      ]
  },
  theme: 'snow'
});

// * GENERAR OPCIONES DE EDITOR
function setBlog(id) {
  let editorNot = `#blog-editor${id}`

  let editorNotas = new Quill(editorNot, {
      bounds: editorNot,
      modules: {
          formula: true,
          syntax: true,
          toolbar: [
              [
                  {
                      font: []
                  },
                  {
                      size: []
                  }
              ],
              ['bold', 'italic', 'underline', 'strike'],
              /* [
                  {
                      color: []
                  },
                  {
                      background: []
                  }
                  ],
                  [
                  {
                      script: 'super'
                  },
                  {
                      script: 'sub'
                  }
                  ],
                  [
                  {
                      header: '1'
                  },
                  {
                      header: '2'
                  },
                  'blockquote',
                  'code-block'
                  ],*/
              [
                  {
                      list: 'ordered'
                  },
                  {
                      list: 'bullet'
                  },
                  /* {
                      indent: '-1'
                  },
                  {
                      indent: '+1'
                  }
                  ],
                  [
                  'direction',
                  {
                      align: []
                  }*/
              ],
              /*['link', 'image', 'video', 'formula'],
              ['clean']*/
          ]
      },
      theme: 'snow'
  });
}

// * EDITAR CLIENTE
function editCliente (id) {
  $('#nombre').removeClass('is-invalid');
  $('#apellido1').removeClass('is-invalid');
  $('#correo').removeClass('is-invalid');
  $('#proximoPagoFecha').removeClass('is-invalid');
  $('#fechaIngresos').removeClass('is-invalid');
  
  $('#type_dni').val($('#type_dniInput').val()).trigger('change');
  $('#status').val($('#statusInput').val()).trigger('change');
  $('#genero').val($('#generoInput').val()).trigger('change');
  $('#grupos').val($('#gruposInput').val()).trigger('change');
  $('#membresia').val($('#membresiaInput').val()).trigger('change');

  $('#edit-cliente').modal('show');
}

if (clientesForm.length) {
  clientesForm.validate({
    errorClass: 'error',
    rules: {
      'nombrecliente': {
        required: true
      },
      'apellidoCliente1': {
        required: true
      },
      'proximoPagoFecha': {
        required: true
      }
    }
  });

  clientesForm.on('submit', function (e) {
    var isValid = clientesForm.valid();   
     
    e.preventDefault();
    
    let formArray = clientesForm.serializeArray();
    console.log(formArray)
    switch (true) {
        case formArray[1]['value']=='':
          $('#nombre').addClass('is-invalid');
          $('#nombre').focus();
          return
          break;
        case formArray[2]['value']=='':
          $('#apellido1').addClass('is-invalid');
          $('#apellido1').focus();
          return
          break;
          case formArray[10]['value']=='':
          $('#correo').addClass('is-invalid');
          $('#correo').focus();
          return
        break;
        case formArray[13]['value']=='':
          $('#proximoPagoFecha').addClass('is-invalid');
         /// $('#proximoPagoFecha').focus();
          return
        break;
        case formArray[17]['value']=='':
          $('#fechaIngresos').addClass('is-invalid');
         // $('#proximoPagoFecha').focus();
          return
        break;
    
      default:
        break;
    }
    if (isValid) {
      $('#nombre').removeClass('is-invalid');
      $('#apellido1').removeClass('is-invalid');
      $('#correo').removeClass('is-invalid');
      $('#proximoPagoFecha').removeClass('is-invalid');
      $('#fechaIngresos').removeClass('is-invalid');
      $.ajax({
        url: `/createNewEditCliente`,
        type: 'POST',
        data: clientesForm.serialize(),
        success: async function (data, textStatus, jqXHR) {
          console.log(data)
          if (data.error) {
            swal.fire('Correo duplicado',data.error,'error');
          }
          if (data.newUser[0].update || data.newUserIfno[0].update || data.newUserinGym[0].update) {
            swal.fire('Actualizado','Datos actualizados con éxito','success').then((result) => {
              if (result.isConfirmed) {
                $('#edit-cliente').modal('hide');
            window.location.reload()
              } else {
                $('#edit-cliente').modal('hide');
            window.location.reload()
              }
            });
            
            return
          }
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
      
    }
    
  });
}


async function graficar(seleccion) {
      console.log(seleccion)
  var newChart,lineChartConfig,valores=[], fechas=[],query, titulo,value,array;
  let URL;
  if (rangePickrMedida.val() == '') {
    array = [moment().subtract(2, 'w').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
    URL = '/MedidasLimit10'
  }else{
    console.log((rangePickrMedida.val()).replace(/\s+/g, ''));
    value =  (rangePickrMedida.val()).replace(/\s+/g, '')
  array = value.split('to');
  URL = '/MedidasEntreDosFechas'
  } 
  
  console.log(array)
 switch (seleccion) {
   case '1':
     query = 'geAltura';
     titulo= 'Altura';
     break;
   case '2':
     query = 'gePeso';
     titulo= 'Peso';
     break;
   case '3':
     query = 'geEdadMetabolica';
     titulo= 'Edad Metabolica';
     break;
     case '4':
     query = 'geIndiceMasaCorporal';
     titulo= 'Indice Masa Corporal';
     break;
     case '5':
     query = 'gePorcentajeGrasaCorporal';
     titulo= 'Porcentaje Grasa Corporal';
     break;
     case '6':
     query = 'geMasaMuscular';
     titulo= 'Masa Muscular';
     break;
     case '7':
     query = 'gePorcentajeGrasaVisceral';
     titulo= 'Porcentaje Grasa Visceral';
     break;
     case '8':
     query = 'gePorcentajeAgua';
     titulo= 'Porcentaje Agua';
     break;
     case '9':
     query = 'geMasaOsea';
     titulo= 'Masa Osea';
     break;
     case '10':
     query = 'mePectoral';
     titulo= 'Pectoral';
     break;
     case '11':
     query = 'meEspalda';
     titulo= 'Espalda';
     break;
     case '12':
     query = 'meBicepDer';
     titulo= 'Bicep Derecho';
     break;
     case '13':
     query = 'meBicepIzq';
     titulo= 'Bicep Izquierdo';
     break;
     case '14':
     query = 'meAntebrazoDer';
     titulo= 'Antebrazo Derecho';
     break;
     case '15':
     query = 'meAantebrazoIzq';
     titulo= 'Antebrazo Izquierdo';
     break;
     case '16':
     query = 'meMusloDer';
     titulo= 'Muslo Derecho';
     break;
     case '17':
     query = 'meMusloIzq';
     titulo= 'Muslo Izquierdo';
     break;
     case '18':
     query = 'mePantorrillaDer';
     titulo= 'Pantorrilla Derecho';
     break;
     case '19':
     query = 'mePantorrillaIzq';
     titulo= 'Pantorrilla Izquierdo';
     break;
     case '20':
     query = 'meCadera';
     titulo= 'Cadera';
     break;
     case '21':
     query = 'meCintura';
     titulo= 'Cintura';
     break;
     case '22':
     query = 'meGluteos';
     titulo= 'Gluteos';
     break;
     case '23':
     query = 'plAbdominal';
     titulo= 'Abdominal';
     break;
     case '24':
     query = 'plSuprailiaco';
     titulo= 'Suprailiaco';
     break;
     case '25':
     query = 'plTriceps';
     titulo= 'Triceps';
     break;
     case '26':
     query = 'plSubescapular';
     titulo= 'Subescapular';
     break;
     case '27':
     query = 'plPectoral';
     titulo= 'Pectoral';
     break;
     case '28':
     query = 'plAxilar';
     titulo= 'Axilar';
     break;
     case '29':
     query = 'plPantorrilla';
     titulo= 'Pantorrilla';
     break;
     case '30':
     query = 'prSistole';
     titulo= 'Sistole';
     break;
     case '31':
     query = 'prDiastole';
     titulo= 'Diastole';
     break;
     case '32':
     query = 'prPulso';
     titulo= 'Pulso';
     break;

 
   default:
     break;
 }
 
        if (array.length == 2) {       
        const data_C = new FormData();
        data_C.append("fechaIni", array[0]);
        data_C.append("fechaFin", array[1]);
        data_C.append("fkIdUsuario", $('#fkIdUsuario').val());
        
        $.ajax({
          url: URL,
          type: 'POST',
          data: data_C,
          cache: false,
          contentType: false,
          processData: false,
          success: async function (data, textStatus, jqXHR) {
            console.log(data.medidas);

            data.medidas.forEach(element => {
              valores.push(element[`${query}`]);
              let newDate= moment(element['creado']).toDate();
              fechas.push(moment(newDate).format('DD/MM/YYYY'))
            });
            console.log(valores);
            console.log(fechas);
            lineChartConfig = {
              chart: {
                height: 400,
                type: 'line',
                zoom: {
                  enabled: false
                },
                parentHeightOffset: 0,
                toolbar: {
                  show: false
                }
              },
              series: [
                {
                  data: valores
                }
              ],
              markers: {
                strokeWidth: 7,
                strokeOpacity: 1,
                strokeColors: [window.colors.solid.white],
                colors: [window.colors.solid.warning]
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'straight'
              },
              colors: [window.colors.solid.warning],
              grid: {
                xaxis: {
                  lines: {
                    show: true
                  }
                },
                padding: {
                  top: -20
                }
              },
              tooltip: {
                custom: function (data) {
                  return (
                    '<div class="px-1 py-50">' +
                    '<span>' +
                    data.series[data.seriesIndex][data.dataPointIndex] +
                    '%</span>' +
                    '</div>'
                  );
                }
              },
              xaxis: {
                categories: fechas
              },
              // yaxis: {
              //   opposite: isRtl
              // }
            };
            $('#titleGrafica').text(titulo)
            newChart = new ApexCharts(document.querySelector('#line-chart'), lineChartConfig);
            newChart.render();
            $('#graficaExample').modal('show')
          },
          error: function (jqXHR, textStatus) {
            console.log('error:' + jqXHR)
          }
        });
        
        }
}

async function deleteMedidaF(fecha, index) {
console.log(fecha)
console.log(index)
var rowjQuery = $(index).closest("th");

fecha = moment(fecha).format('YYYY-MM-DD');
  const data = new FormData();
  data.append("fecha", fecha);
  data.append("fkIdUsuario", $('#fkIdUsuario').val());
  Swal.fire({
    title: 'Seguró desea eliminar?',
    text: "Seguro desea eliminar la medida indicada, luego no se podrá revertir la operación",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/deleteMedidaF`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success:async  function (data, textStatus, jqXHR) {

          if (data.medidaDelete == 0) {
            Swal.fire(
              'Error!',
              'Corrió un error intentando borrar la medida',
              'warning'
            )
            return
          }
          $(`#TableGeneralMedidas td:nth-child(${rowjQuery[0].cellIndex +1}),#TableGeneralMedidas th:nth-child(${rowjQuery[0].cellIndex +1})`).remove();
          Swal.fire(
            'Borrado!',
            'Medida borrada con éxito.',
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

async function editarMedidaF(fecha, index) {
  console.log(fecha)
  console.log(index)
  var rowjQuery = $(index).closest("th");  
  fecha = moment(fecha).format('YYYY-MM-DD');
    const data = new FormData();
    data.append("fecha", fecha);
    data.append("fkIdUsuario", $('#fkIdUsuario').val());

        $.ajax({
          url: `/VerificaMedidabycreadoandUser`,
          type: 'POST',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          success:async  function (data, textStatus, jqXHR) {
          console.log(data);
          $('#geAltura').val(data.verificar[0]['geAltura'])
           $('#gePeso').val(data.verificar[0]['gePeso'])
           $('#geEdadMetabolica').val(data.verificar[0]['geEdadMetabolica'])
           $('#geIndiceMasaCorporal').val(data.verificar[0]['geIndiceMasaCorporal'])
           $('#gePorcentajeGrasaCorporal').val(data.verificar[0]['gePorcentajeGrasaCorporal'])
           $('#geMasaMuscular').val(data.verificar[0]['geMasaMuscular'])
            $('#gePorcentajeGrasaVisceral').val(data.verificar[0]['gePorcentajeGrasaVisceral'])
            $('#gePorcentajeAgua').val(data.verificar[0]['gePorcentajeAgua'])
            $('#geMasaOsea').val(data.verificar[0]['geMasaOsea'])
           $('#mePectoral').val(data.verificar[0]['mePectoral'])
           $('#meEspalda').val(data.verificar[0]['meEspalda'])
           $('#meBicepDer').val(data.verificar[0]['meBicepDer'])
           $('#meBicepIzq').val(data.verificar[0]['meBicepIzq'])
           $('#meAntebrazoDer').val(data.verificar[0]['meAntebrazoDer'])
           $('#meAantebrazoIzq').val(data.verificar[0]['meAantebrazoIzq'])
           $('#meMusloDer').val(data.verificar[0]['meMusloDer'])
           $('#meMusloIzq').val(data.verificar[0]['meMusloIzq'])
           $('#mePantorrillaDer').val(data.verificar[0]['mePantorrillaDer'])
           $('#mePantorrillaIzq').val(data.verificar[0]['mePantorrillaIzq'])
           $('#meCadera').val(data.verificar[0]['meCadera'])
           $('#meCintura').val(data.verificar[0]['meCintura'])
           $('#meGluteos').val(data.verificar[0]['meGluteos'])
           $('#plAbdominal').val(data.verificar[0]['plAbdominal'])
           $('#plSuprailiaco').val(data.verificar[0]['plSuprailiaco'])
           $('#plTriceps').val(data.verificar[0]['plTriceps'])
          $('#plSubescapular').val(data.verificar[0]['plSubescapular'])
            $('#plPectoral').val(data.verificar[0]['plPectoral'])
           $('#plAxilar').val(data.verificar[0]['plAxilar'])
           $('#plPantorrilla').val(data.verificar[0]['plPantorrilla'])
           $('#prSistole').val(data.verificar[0]['prSistole'])
              $('#prDiastole').val(data.verificar[0]['prDiastole'])
            $('#prPulso').val(data.verificar[0]['prPulso'])
            $('#creado').val(moment(data.verificar[0]['creado']).format('YYYY-MM-DD'))
            $('#pkIdMedidas').val(data.verificar[0]['pkIdMedidas'])
            $('#rowIndex').val(rowjQuery[0].cellIndex +1)
            
            $('#medidas-modal').modal('show')
          },
          error: function (jqXHR, textStatus) {
            console.log('error:' + jqXHR)
          }
        });

  
  
  }

  $('#upgradePlanModal').on('show.bs.modal', function (e) {
    $('#planActual').val($('#membresiaInput').val()).trigger('change');
    if ($('#planActual').val() == 0) {
      $('.personalize').each(function (index, element) {
        $(this).removeClass('d-none')
      });
    }
  });

  $('#planActual').on('change', function () {
    if ($('#planActual').val() == 0) {
      $('.personalize').each(function (index, element) {
        $(this).removeClass('d-none')
      });
    } else {
      $('.personalize').each(function (index, element) {
        $(this).addClass('d-none')
      });
    }
  });

  $('#upgradePlanForm').on('submit', function (e) {
    if ($('#facturasCheck:checked').val() == "on") {
      e.preventDefault()
      window.location.href = "/facturas"
    }
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
  
      let content = $('#editor_plan .ql-editor .rowExercise');
      let timeout = setTimeout(() => {
        if (content.length) {
          $('#editor_plan .ql-editor').append(info);
        } else {
          $('#editor_plan .ql-editor').html(info);
        }
  
        // * HTML EJERCICIOSR
        $('#textarea').val($('#editor_plan .ql-editor').html());
        $('#descriptionPlan').val(ejercicioFilter[0].descripcion)
        mostrarCategorias(ejercicioFilter[0].categoria);
        clearTimeout(timeout);
      }, 1000);
  
    }
  });

  $('#programasGlobales').change(function (e) {
    let id_selection = $(this).val();
    console.log(id_selection);
    let programasFilter = programas.filter(element => element.pkIdPrograma == id_selection);
    $('#tituloPrograma').val(programasFilter[0].titulo )
    $('#editor_plan .ql-editor').html(programasFilter[0].descripcion)
    $('#descriptionPlan').val(programasFilter[0].descripcion)
    $('#programaGlobalId').val(programasFilter[0].pkIdPrograma)
  })
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

