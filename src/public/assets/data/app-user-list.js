/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------

==========================================================================================*/
var users, activeUsers = 0,InactiveUsers=0;
var roles;
var dtUserTable = $('.user-list-table'),
  newUserSidebar = $('.new-user-modal'),
  newUserForm = $('.add-new-user'),
  editUserForm = $('.edit-user-form'),
  select = $('.select2'),
  dtContact = $('.dt-contact'),
  statusObj = {
    true: { title: 'Active', class: 'badge-light-success' },
    false: { title: 'Inactive', class: 'badge-light-secondary' }
  };

var assetPath = '../../../app-assets/';
async function getUsers (){
 users=await fetch("/getUsersList")
      .then((response) => response.json())
      .then((data) => {
        return data.users;
      });
      createTable();
      $('#total_users').text(users.length);
      
      for (let i = 0; i < users.length; i++) {
        if (users[i]['enabled'] == true) {
          activeUsers++;
          continue
        }
        InactiveUsers++;
      }
      $('#total_users-active').text(activeUsers);
       $('#total_users-inactive').text(InactiveUsers);
}
function createTable() {
 
if ($('body').attr('data-framework') === 'laravel') {
  assetPath = $('body').attr('data-asset-path');
  userView = assetPath + 'app/user/view/account';
}

select.each(function () {
  var $this = $(this);
  $this.wrap('<div class="position-relative"></div>');
  $this.select2({
    // the following code is used to disable x-scrollbar when click in select input and
    // take 100% width in responsive also
    dropdownAutoWidth: true,
    width: '100%',
    dropdownParent: $this.parent()
  });
});

// Users List datatable
if (dtUserTable.length) {
  dtUserTable.DataTable({
    data: users,
    columns: [
      // columns according to JSON
      { data: 'id' },
      { data: 'firstName' },
      { data: 'username' },
      { data: 'enabled' },      
      { data: 'totp' },
      { data: 'id' }
    ],
    columnDefs: [
      {// For control- Targe 0
        
        className: 'control',
        orderable: false,
        targets: 0,
        visible: false,
      },
      {// User full name and username- Target 1
        targets: 1,
        render: function (data, type, full, meta) {
          var name = full['firstName']+ " "+full['lastName'],
            email = full['email'], image='';

            // For Avatar badge
            var stateNum = Math.floor(Math.random() * 6) + 1;
            var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
            var state = states[stateNum],
              initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
            output = '<span class="avatar-content">' + initials + '</span>';
          var colorClass = image === '' ? ' bg-light-' + state + ' ' : '';
          // Creates full output for row
          var row_output =`<div class="d-flex justify-content-left align-items-center">
          <div class="avatar-wrapper">
            <div class="avatar ${colorClass} me-1">
            ${output} 
            </div>
          </div>
          <div class="d-flex flex-column">
            <span class="fw-bolder">${name}</span>
            <small class="emp_post text-muted">${email}</small>
          </div>
        </div>`;
          return row_output;
        }
      },
      {// User Status target 3
        targets: 3,className:'status',
        render: function (data, type, full, meta) {
         
          var status = data;
          return (`<span class="badge rounded-pill ${statusObj[status].class} S${full['id']}" text-capitalized style="cursor:pointer;" onclick="changeStatus('${full['id']}', '${data}','${meta.row}')">${statusObj[status].title}</span>`
          );
        }
      },
      {// User TOTP target 4
        targets: 4,
        render: function (data, type, full, meta) {
          var status = data;
          return (`<span class="badge rounded-pill ${statusObj[status].class}" text-capitalized >${statusObj[status].title}</span>`
          );
        }
      },
      {// Actions
        targets: -1,
        title: 'Actions',
        orderable: false,
        render: function (data, type, full, meta) {
          let disabled = "";
          if ($('#hid').val() == full['id']) {
            disabled = "disabled";
          }
          return (
            `<div class="btn-group">
              <a class="dropdown-toggle hide-arrow " data-bs-toggle="dropdown">${feather.icons['more-vertical'].toSvg({ class: 'font-small-4' })}</a>
              <div class="dropdown-menu" data-popper-placement="top-start">
                <a href="javascript:;" class="dropdown-item edit-record${full['id']}" onclick="editUser('${full['id']}')" ${disabled}>${feather.icons['edit-2'].toSvg({ class: 'font-small-4 me-50' })}Edit</a>
                <a href="javascript:;" class="d-none delete-record${full['id']}" onclick="deleteUser('${full['id']}')" ${disabled}>${feather.icons['trash-2'].toSvg({ class: 'font-small-4 me-50' })}Delete</a>
                <a href="/history/${full['id']}" class="dropdown-item" >${feather.icons['pocket'].toSvg({ class: 'font-small-4 me-50' })}Sessions</a>
              </div>
            </div>`
          );
        }
      }
    ],
    order: [[1, 'desc']],
    dom:
      '<"d-flex justify-content-between align-items-center header-actions mx-2 row mt-75"' +
      '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
      '<"col-sm-12 col-lg-8 ps-xl-75 ps-0"<"dt-action-buttons d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>B>>' +
      '>t' +
      '<"d-flex justify-content-between mx-2 row mb-1"' +
      '<"col-sm-12 col-md-6"i>' +
      '<"col-sm-12 col-md-6"p>' +
      '>',
    language: {
      sLengthMenu: 'Show _MENU_',
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
        text: 'Add New User',
        className: 'add-new btn btn-primary',
        attr: {
          'data-bs-toggle': 'modal',
          'data-bs-target': '#modals-slide-in'
        },
        init: function (api, node, config) {
          $(node).removeClass('btn-secondary');
        }
      }
    ],
    initComplete: function () {
      // Adding status filter once table initialized
      this.api()
        .columns(3)
        .every(function () {
          var column = this;
          var label = $('<label class="form-label" for="FilterTransaction">Status</label>').appendTo('.user_status');
          var select = $(
            '<select id="FilterTransaction" class="form-select text-capitalize mb-md-0 mb-2xx"><option value=""> Select Status </option></select>'
          )
            .appendTo('.user_status')
            .on('change', function () {
              var val = $.fn.dataTable.util.escapeRegex($(this).val());
              column.search(val ? '^' + val + '$' : '', true, false).draw();
            });

          column
            .data()
            .unique()
            .sort()
            .each(function (d, j) {
              select.append(
                '<option value="' +
                  statusObj[d].title +
                  '" class="text-capitalize">' +
                  statusObj[d].title +
                  '</option>'
              );
            });
        });
    }
  });
}

// Form Validation
if (newUserForm.length) {
  newUserForm.validate({
    errorClass: 'error',
    rules: {
      'user-Firstname': {
        required: true
      },
      'user-name': {
        required: true
      },
      'user-email': {
        required: true
      }
    }
  });

  newUserForm.on('submit', function (e) {
    var isValid = newUserForm.valid();    
    e.preventDefault();
    if (isValid) {
      $.ajax({
        url: `/save-add-new-user`,
        type: 'POST',
        data: $('#add-user-form').serialize(),
        success: async function (data, textStatus, jqXHR) {
          
          if (data.rest) {
            swal.fire(data.rest.errorMessage)
            return
          }
           $('.user-list-table').DataTable().row.add(data.infoUser).draw();
  newUserSidebar.modal('hide');
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
      
    }
  });
}

// Phone Number
if (dtContact.length) {
  dtContact.each(function () {
    new Cleave($(this), {
      phone: true,
      phoneRegionCode: 'US'
    });
  });
}
}
async function getRoles (){
 roles=await fetch("/getAllClientsRoles")
      .then((response) => response.json())
      .then((data) => {
        return data.Roles;
      });
      $('#user-role').empty();
      for (let i = 0; i < roles.length; i++) {
        $('#user-role').append(`<option value="${roles[i]['name']}" data-id="${roles[i]['id']}" data-container="${roles[i]['containerId']}">${roles[i]['name']}</option>`);
        if (i==0) {
          $('#role-0-name').text(roles[i]['name']);
          $('#role-edit-modal0').attr('data-rolename', roles[i]['name']);
          $('#role-edit-modal0').attr('data-id', roles[i]['id']);
          $('#role-edit-modal0').attr('data-container', roles[i]['containerId']);
         await fetch("/getUsersClientsRoles/"+roles[i]['name'])
          .then((response) => response.json())
          .then((data) => {
             $('#role-0-count').text(data.users.length);
          });          
        }
        if (i == 1) {
          $('#role-1-name').text(roles[i]['name']);
          $('#role-edit-modal1').attr('data-rolename', roles[i]['name']);
          $('#role-edit-modal1').attr('data-id', roles[i]['id']);
          $('#role-edit-modal1').attr('data-container', roles[i]['containerId']);
          await fetch("/getUsersClientsRoles/"+roles[i]['name'])
          .then((response) => response.json())
          .then((data) => {
            
             $('#role-1-count').text(data.users.length);
          });  
        }
      }
}
$(function () {
  ('use strict');
getUsers();
getRoles ();
// Form Validation
if (editUserForm.length) {
  editUserForm.validate({
    errorClass: 'error',
    rules: {
      'user-Firstname': {
        required: true
      },
      'user-name': {
        required: true
      },
      'user-email': {
        required: true
      }
    }
  });

  editUserForm.on('submit', function (e) {
    var isValid = editUserForm.valid();    
    e.preventDefault();
    if (isValid) {
      var option = $('#user-role').find(':selected');
      var idRole = option.data('id');
      var containerIdR = option.data('container');
      $.ajax({
        url: `/save-edited-user`,
        type: 'POST',
        data: $('#edit-user-form').serialize() + `&idRole=${idRole}&containerIdR=${containerIdR}`,
        success: async function (data, textStatus, jqXHR) {
          if (data.rest == 204) {
            swal.fire("Successfully edited user");
          }
  $('#modals-slide-editU').modal('hide');
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
      
    }
  });
}

});
function deleteUser(id) {
   const data = new FormData();
      data.append("id", id);
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/delete-user`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
    success: function (data, textStatus, jqXHR) {
      
      $('.user-list-table').DataTable().row($(`.user-list-table tbody .delete-record${id}`).parents('tr')).remove().draw();
      Swal.fire(
        'Deleted!',
        'User has been deleted.',
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

function editUser(id) {
  const data = new FormData();
     data.append("idUser", id);
     $.ajax({
       url: `/get-edit-user`,
       type: 'POST',
       data: data,
       cache: false,
       contentType: false,
       processData: false,
   success: function (data, textStatus, jqXHR) {
   console.log(data);
   if (data.errorLogSave) {
    swal.fire("Error, please check the ErrorLog table. ErrorLogKey: "+data.errorLogSave);
    return;
   }
$('#edit-user-id').val(data.infoUser.id);
$('#edit-user-default-Firstname').val(data.infoUser.firstName);
$('#edit-user-default-Lastname').val(data.infoUser.lastName);
$('#edit-user-default-uname').val(data.infoUser.username);
$('#edit-user-default-phone').val(data.userSQL[0].Phone);
$('#edit-user-default-email').val(data.infoUser.email);
     $('#modals-slide-editU').modal('show');
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
       url: `/changeUserStatus`,
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


$('#btn_ad_role_user').click(function(){
  var userId = $('#edit-user-id').val();
  var roleName= $('#user-role').val();
  var option = $('#user-role').find(':selected');
  var idRole = option.data('id');
  var containerIdR = option.data('container');
  $.ajax({
    url: `/AddClientRoleUser`,
    type: 'POST',
    data: `userId=${userId}&idRole=${idRole}&containerIdR=${containerIdR}&roleName=${roleName}`,
    success: async function (data, textStatus, jqXHR) {
      getRoles ();
      if (data.rest == 204) {
        swal.fire("Successfully assigned role");
      }
    $('#modals-slide-editU').modal('hide');
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });
})