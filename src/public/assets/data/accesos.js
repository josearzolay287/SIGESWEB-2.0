/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var accesos, activeaccesos = 0, Inactiveaccesos = 0, startDate, endDate;
var dtaccesosTable = $('#accesos-Table'),
  newaccesosidebar = $('.new-user-modal'),
  select = $('.select2'),
  statusObj = {
    'Y': { title: 'Deshabilitado', class: 'badge-light-danger' },
    'N': { title: 'Habilitado', class: 'badge-light-success' }
  };
  

async function getaccesos() {
  accesos = await fetch("/getIngresosByfkIdGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.response;
    });
  console.log(accesos);
  let ingresos = 1, denegados = 1;
  accesos.forEach(element => {
      element.ingresoFallido == 'N' ? $('#ingresosCount').text(ingresos++) : null
      element.ingresoFallido == 'Y' ? $('#fallidosCount').text(denegados++) : null
  });
  createTable();
}
function createTable() {
  // accesos List datatable
  if (dtaccesosTable.length) {
    $('#buscador').on('keyup change', function(){
      dtaccesosTable.DataTable().search(this.value).draw();   
    });
    $('#selectEstado').on('change', function(){
      console.log(this.value)
      dtaccesosTable.DataTable().column(1).search(this.value).draw();   
    });
    dtaccesosTable.DataTable({
      data: accesos,
      columns: [
        // columns according to JSON
        { data: 'nombre' },
        { data: 'ingresoFallido' },
        { data: 'fecha' },
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
        {// User Status target 1
          targets: 1,className:'status',
          render: function (data, type, full, meta) {          
            var status = data;          
            // if (status == "undefined" || status == null || status > 3) {    
            //   console.log(status)       
            //   status=0;
            // }
            return (`<span class="badge rounded-pill ${statusObj[status].class} text-capitalize" >${statusObj[status].title}</span>`
            );
          }
        },
      ],
      order: [[2, 'desc']],
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
    $('#accesos-Table_filter input').removeClass('form-control-sm')
    $('#accesos-Table_filter').addClass('d-none')

  }

}
function filterDate(Start,End) {
  $.fn.DataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = startDate;
        var max = endDate;
        var date = moment(new Date( data[2] )).format('YYYY-MM-DD H:mm:ss');
        console.log(min)
        console.log(date)
        if (
            ( min === null && max === null ) ||
            ( min === null && date <= max ) ||
            ( min <= date   && max === null ) ||
            ( min <= date   && date <= max )
        ) {
            return true;
        }
        return false;
    }

);
dtaccesosTable.DataTable().draw(); 
}
if ($('#fechaRange').length) {
  $('#fechaRange').flatpickr({
    mode: 'range',
      enableTime: true,
      altFormat: 'Y-m-d H:i:S',
    onChange: function (selectedDates) {
      var _this = this;
      var dateArr = selectedDates.map(function (date) { return _this.formatDate(date, 'Y-m-d H:i:S'); });
      startDate = dateArr[0];
      endDate = dateArr[1];
      if (startDate && endDate) {

        filterDate();        
      }else{
        startDate = null;
        endDate = null;
        filterDate()
      }
      
    },
  });
}
$(function () {
  ('use strict');
  getaccesos();
});