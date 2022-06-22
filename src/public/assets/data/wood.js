/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var wood, commentWood,
  newprogramasidebar = $('.new-user-modal'),
  woodForm = $('#formWood');
  async function getwood() {
    wood = await fetch("/getWood")
      .then((response) => response.json())
      .then((data) => {
        return data.response;
      });
    console.log(wood);
    if (wood.length > 0) {
      $('#idWood').val(wood[0].pkIdWood);
    $('#tituloWood').val(wood[0].titulo);
    $('#hiddenAreaedit').val(wood[0].descripcion);
    $("#editor2 .ql-editor").html(wood[0].descripcion);
    $("#fechaWood").text(moment(wood[0].fecha).format('DD-MM-YYYY'));
    $('#comments').removeClass('d-none');
      comentariosgetwood()
    }
    
  }
  async function comentariosgetwood() {
    commentWood = await fetch("/gettingCometarioWood/"+wood[0].pkIdWood)
      .then((response) => response.json())
      .then((data) => {
        return data.response;
      });
    console.log(commentWood);
      let ul
      for (let i = 0; i < commentWood.length; i++) {
        ul = `<li class="list-group-item d-flex align-items-center justify-content-between" id="coment${commentWood[i].pkIdWoodComentario}">
        ${commentWood[i].comentario}
        <a onclick=deleteComment('${commentWood[i].pkIdWoodComentario}')>${feather.icons['trash'].toSvg({class: 'text-primary'})}</a></li>`;
        $('#comentsList').append(ul)
        
      }
  }


function deleteComment(id) {
  const data = new FormData();
  data.append("pkIdWoodComentario", id);
  Swal.fire({
    title: 'Deseas eliminar este comentario?',
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
        url: `/deleteComentarioWood`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {
        console.log(data)
        $(`#coment${id}`).remove();
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
    }
  });
}
async function Nuevocomentario() {
  const data = new FormData();
  data.append("comentario", $('#comentarioWood').val());
  data.append("pkIdWood", $('#idWood').val());
  $.ajax({
    url: `/newComentarioWood`,
    type: 'POST',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data, textStatus, jqXHR) {
    console.log(data)

    let ul = `<li class="list-group-item d-flex align-items-center justify-content-between" id="coment${data.wood}">
    ${$('#comentarioWood').val()}
    <a onclick=deleteComment('${data.wood}')>${feather.icons['trash'].toSvg({class: 'text-primary'})}</a></li>`;
    $('#comentsList').append(ul);
    
    $('#comentarioWood').val('');
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });
}
$(function () {
  ('use strict');
  getwood()

  if (woodForm.length) {
    woodForm.validate({
      errorClass: 'error',
      rules: {
        'tituloWood': {
          required: true
        },
      }
    });
  
    woodForm.on('submit', function (e) {
      var isValid = woodForm.valid();
      $("#hiddenAreaedit").val($("#editor2 .ql-editor").html());
      e.preventDefault();
      let url = "saveWood";
      if ($('#idWood').val() !== "") {
        url = "editWood";
      }
      if (isValid) {
        $.ajax({
          url: `/${url}`,
          type: 'POST',
          data: woodForm.serialize(),
          success: async function (data, textStatus, jqXHR) {
            console.log(data)
            $('#idWood').val(data.wood)
            $('#fechaWood').text(moment().format('DD-MM-YYYY'))
            $('#comments').removeClass('d-none');
          },
          error: function (jqXHR, textStatus) {
            console.log('error:' + jqXHR)
          }
        });
  
      }
    });
  }
})
