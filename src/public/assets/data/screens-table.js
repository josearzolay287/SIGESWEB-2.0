/**
 * App user list
 */
  var dataTablePermissions = $('#screens-table'),
    assetPath = '../../../app-assets/',
    dt_permission, screensData,AccessRoleScreen, Roles;

  async function getScreens (){
      screensData=await fetch("/getScreensList")
           .then((response) => response.json())
           .then((data) => {
             return data.getScreensSQL;
           });
           tableScreens()
     }
   async function tableScreens() {
      AccessRoleScreen = await fetch("/getAlllvlRoleScreen")
           .then((response) => response.json())
           .then((data) => {
             return data.getlvlRoleScreen;
           });
           Roles = await fetch("/getAllRolesSQL")
           .then((response) => response.json())
           .then((data) => {
             return data.RolesSQL;
           });
           var roleBadgeObj = {};
           for (let i = 0; i < Roles.length; i++) {
            roleBadgeObj[Roles[i]['RoleKey']]={name:`<span class="badge rounded-pill badge-light-primary">${Roles[i]['SSORoleName']}</span>`}
             
           }
        // Users List datatable
  if (dataTablePermissions.length) {
    dt_permission = dataTablePermissions.DataTable({
      data: screensData,
      columns: [
        // columns according to JSON
        { data: 'ScreenID' },
        { data: 'ScreenName' },
        { data: 'ScreenDescription' },
        { data: 'ScreenKey' },
        { data: 'DateCreated' },
        { data: '' }
      ],
      columnDefs: [
        {
          // remove ordering from Name
          targets: 1,
          orderable: true,
          render: function (data, type, full, meta) {
            return `<p class="mb-0" style="width: 200px; white-space: normal">${full['ScreenName']}</p>`
          }
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            return `<p class="mb-0" style="width: 250px; white-space: normal">${full['ScreenDescription']}</p>`
          }
        },
        {
          // User Role
          targets: 3,
          orderable: false,
          render: function (data, type, full, meta) {
            var $output = '';
            for (var i = 0; i < AccessRoleScreen.length; i++) {
              if (AccessRoleScreen[i]['ScreenKey'] == data) {
                $output += roleBadgeObj[AccessRoleScreen[i]['RoleKey']].name;
              }
              
            }
            return $output;
          }
        },
        {
          targets: 4,
          orderable: true,
          render: function (data, type, full, meta) {
            return moment.tz(data, "America/Los_Angeles").format('MM/DD/YYYY HH:mm:ss a'); 
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<button class="btn btn-sm btn-icon" data-bs-toggle="modal" data-bs-target="#editPermissionModal">' +
              feather.icons['edit'].toSvg({ class: 'font-medium-2 text-body' }) +
              '</i></button>'
            );
          }
        }
      ],
      order: [[0, 'asc']],
      dom:
        '<"d-flex justify-content-between align-items-center header-actions text-nowrap mx-1 row mt-75"' +
        '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
        '<"col-sm-12 col-lg-8"<"dt-action-buttons d-flex align-items-center justify-content-lg-end justify-content-center flex-md-nowrap flex-wrap"<"me-1"f><"user_role mt-50 width-200 me-1">B>>' +
        '><"text-nowrap" t>' +
        '<"d-flex justify-content-between mx-2 row mb-1"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: 'Show _MENU_',
        search: 'Search',
        searchPlaceholder: 'Search..'
      },
      // Buttons with Dropdown
      buttons: [
        // {
        //   text: 'Add Screen',
        //   className: 'add-new btn btn-primary mt-50',
        //   attr: {
        //     'data-bs-toggle': 'modal',
        //     'data-bs-target': '#addPermissionModal'
        //   },
        //   init: function (api, node, config) {
        //     $(node).removeClass('btn-secondary');
        //   }
        // }
      ],
      language: {
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      initComplete: function () {
        // Adding role filter once table initialized
        this.api()
          .columns(3)
          .every(function () {
            var column = this;
             let options;
            for (let i = 0; i < Roles.length; i++) {
              options +=`<option value="${Roles[i]['SSORoleName']}" class="text-capitalize">${Roles[i]['SSORoleName']}</option>`;               
             }
           var select = $(`<select id="UserRole" class="form-select text-capitalize"><option value=""> Select Role </option>${options}</select>`)
              .appendTo('.user_role')
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? val : '', true, false).draw();
              });
          });
      }
    });
  }
    }
$(function () {
  'use strict';
  getScreens ();


  if ($('body').attr('data-framework') === 'laravel') {
    assetPath = $('body').attr('data-asset-path');
     assetPath + 'app/user/list';
  }
    // Delete Record
  $('.datatables-permissions tbody').on('click', '.delete-record', function () {
    dt_permission.row($(this).parents('tr')).remove().draw();
  });

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').removeClass('form-control-sm');
    $('.dataTables_length .form-select').removeClass('form-select-sm');
  }, 300);
});
