//var socket = io.connect("https://UECSM.mosquedacordova.com/",  { secure: true });
var socket = io.connect("http://localhost:5001", { forceNew: true });

socket.on("messages", function (data) {
  console.log(data);
  render(data);
});

function render(notif) {
  let alert,cantAlerta
  var isRtl = $('html').attr('data-textdirection') === 'rtl';
  switch (notif.tipo) {
    case 'Fallido':
      toastr['warning'](
        `El usuario ${notif.usuario} a realizado un ingreso fallido!`,
        '👋 Ingreso Fallido!',
        {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        }
      );
      alert = `<a class="d-flex" href="#">
      <div class="list-item d-flex align-items-start">
          <div class="me-1">
              <div class="avatar"><img src="../../app-assets/images/portrait/small/avatar-s-15.jpg" alt="avatar" width="32" height="32"></div>
          </div>
          <div class="list-item-body flex-grow-1">
              <p class="media-heading">
                  <span class="fw-bolder">${notif.usuario} 🎉</span> Ingreso Fallido!</p>
          </div>
      </div>
  </a>`;
  cantAlerta = parseInt($('#nuevasAlert1').text());
  cantAlerta = cantAlerta +1;
        $('.media-list').append(alert);
        $('#nuevasAlert0').text(cantAlerta)
        $('#nuevasAlert1').text(cantAlerta)
      break;
      case 'Correcto':
      toastr['success'](
        `El usuario ${notif.usuario} a realizado un ingreso correcto!`,
        '👋 Ingreso Correcto!',
        {
          closeButton: true,
          tapToDismiss: false,
          rtl: isRtl
        }
      );
      alert = `<a class="d-flex" href="#">
      <div class="list-item d-flex align-items-start">
          <div class="me-1">
              <div class="avatar"><img src="../../app-assets/images/portrait/small/avatar-s-15.jpg" alt="avatar" width="32" height="32"></div>
          </div>
          <div class="list-item-body flex-grow-1">
              <p class="media-heading">
                  <span class="fw-bolder">${notif.usuario} 🎉</span> Ingreso Correcto!</p>
          </div>
      </div>
  </a>`;
  cantAlerta = parseInt($('#nuevasAlert1').text());
  cantAlerta = cantAlerta + 1;
        $('.media-list').append(alert);
        $('#nuevasAlert0').text(cantAlerta)
        $('#nuevasAlert1').text(cantAlerta)
      break;
    default:
      break;
  }


}