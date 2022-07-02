/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var matricula, activematricula = 0,Inactivematricula=0, paginacion = [], grupos;
var roles;
var reportesTable = $('#reportesTable'),
  newmatriculaidebar = $('.new-user-modal'),
  matirculaForm = $('#matirculaForm'),
  matirculaForm2 = $('#formClienteInfo2'),
  select = $('.select2'),
  dtContact = $('.dt-contact'),
  grados = {
    1: { title: '1ero', class: 'badge-light-danger' },
    2: { title: '2do', class: 'badge-light-success' },
    3: { title: '3ero', class: 'badge-light-warning' },
    4: { title: '4to', class: 'badge-light-warning' },
    5: { title: '5to', class: 'badge-light-warning' },
    6: { title: '6to', class: 'badge-light-warning' },
    7: { title: '1er año', class: 'badge-light-warning' },
    8: { title: '2do año', class: 'badge-light-warning' },
    9: { title: '3er año', class: 'badge-light-warning' },
    10: { title: '4to año', class: 'badge-light-warning' },
    11: { title: '5to año', class: 'badge-light-warning' }
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
if (reportesTable.length) {
  $('#filtroBuscador').on('keyup change', function(){
    dataTablematricula.search(this.value).draw();   
  });
  $('#filtroRoles').on('change', function(){
    dataTablematricula.column(3).search(this.value).draw();   
  });
  let filterMatricula = matricula.filter(x => x.gradoEstudiante == 1)
  console.log("🚀 ~ file: reportes.js ~ line 58 ~ createTable ~ filterMatricula", filterMatricula)
  let dataTablematricula = reportesTable.DataTable({
    data: filterMatricula,
    columns: [
      // columns according to JSON
      { data: 'id_al' },
      //{ data: 'gradoEstudiante' },
      { data: 'cedulaEstudiante' },
      { data: 'nombreEstudiante' },
      { data: 'Representantes.0.nombreRepresentante' },
      { data: 'telefonosEstudiante' },
      { data: 'Representantes.0.email' },
      { data: 'generoEstudiante' },
      { data: 'fechaNacimiento' },
      { data: 'edadEstudiante' },
    ],
    columnDefs: [  
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
      {
        extend: "excel",
        cells: ['A2:I2'],
        insertCells: [
                {
                    cells: '1',              // Target data row 5 and 6
                    content: `República Bolivariana de Venezuela \n
                    Ministerio del Poder Popular para la Educación\n
                    U.E.C "Santa María"\n
                    Ciudad Bolívar-Estado Bolívar`,                // Add empty content
                    pushRow: true,
                    style: {
                      font: {
                          b: true,
                      },
                      alignment: {
                          vertical: "center",
                          horizontal: "center",
                      },
                      border: {
                          top: 'thick',
                          bottom: 'thick',
                          left: 'thick',
                          right: 'thick',
                      },
                      alignment: {
                        vertical: "center",
                        horizontal: "left",
                        wrapText: true,
                    }
                  }               // push the rows down to insert the content
                },
            ],              // Extend the excel button
        excelStyles: {                // Add an excelStyles definition
            template: "blue_medium",  // Apply the 'blue_medium' template
        },
    },

    ],
    initComplete: function () {

    },
    drawCallback: function () {
     
    },
  });

  $('#matriculaTable_filter').addClass('d-none')
  
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

$('#gradoEstudiante').change(function () {
  console.log(this.value);
let filterMatricula = matricula.filter(x => x.gradoEstudiante == this.value);
console.log("🚀 ~ file: reportes.js ~ line 210 ~ filterMatricula", filterMatricula)
reportesTable.DataTable().clear();  
for (let i = 0; i < filterMatricula.length; i++) {
  reportesTable.DataTable().row.add(filterMatricula[i]);          
} 
reportesTable.DataTable().draw();
  
})