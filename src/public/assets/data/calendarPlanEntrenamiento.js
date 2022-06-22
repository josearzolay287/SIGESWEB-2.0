/**
 * App Calendar
 */

/**
 * ! If both start and end dates are same Full calendar will nullify the end date value.
 * ! Full calendar will end the event on a day before at 12:00:00AM thus, event won't extend to the end date.
 * ! We are getting events from a separate file named app-calendar-events.js. You can add or remove events from there.
 **/

'use-strict';
var gruposFiltro, calendarsColor = {};
// RTL Support
var direction = 'ltr',
  assetPath = 'app-assets/';
if ($('html').data('textdirection') == 'rtl') {
  direction = 'rtl';
}

if ($('body').attr('data-framework') === 'laravel') {
  assetPath = $('body').attr('data-asset-path');
}

$(document).on('click', '.fc-sidebarToggle-button', function (e) {
  $('.app-calendar-sidebar, .body-content-overlay').addClass('show');
});

$(document).on('click', '.body-content-overlay', function (e) {
  $('.app-calendar-sidebar, .body-content-overlay').removeClass('show');
});
document.addEventListener('DOMContentLoaded', function () {

  var calendarEl = document.getElementById('calendar'),
    eventToUpdate,
    sidebar = $('.event-sidebar'),
    // calendarsColor = {
    //   'g11': 'primary',
    //   g12: 'success',
    //   Negro: 'danger',
    //   Verde: 'warning',
    // },
    eventForm = $('#formPlanEntrenamiento'),
    addEventBtn = $('.add-event-btn'),
    cancelBtn = $('.btn-cancel'),
    updateEventBtn = $('.update-event-btn'),
    toggleSidebarBtn = $('.btn-toggle-sidebar'),
    eventTitle = $('#tituloPrograma'),
    eventLabel = $('#select-label'),
    startDate = $('#start-date'),
    rangePickr = $('#fechaPlanEntrenamiento'),
    endDate = $('#end-date'),
    // eventUrl = $('#event-url'),
    // eventGuests = $('#event-guests'),
    // eventLocation = $('#event-location'),
    allDaySwitch = $('.allDay-switch'),
    selectAll = $('.select-all'),
    calEventFilter = $('.calendar-events-filter'),
    filterInput = $('.input-filter'),
    btnDeleteEvent = $('.btn-delete-event'),
    calendarEditor = $('#editor_plan .ql-editor');
    // entrenador = $('#entrenador'),
    // precio = $('#precio'),
    // espacios = $('#espacios'),
    // repetir = $('#repetir'),
    // gruposPermitidos = $('#gruposPermitidos'),
    // color = $('#color');

  // --------------------------------------------
  // On add new item, clear sidebar-right field fields
  // --------------------------------------------
  $('.add-event button').on('click', function (e) {
    $('.event-sidebar').addClass('show');
    $('.sidebar-left').removeClass('show');
    $('.app-calendar .body-content-overlay').addClass('show');
  });
  // Start date picker
  if (rangePickr.length) {
    rangePickr.flatpickr({
      mode: 'range',
      enableTime: true,
      altFormat: 'Y-m-d H:i:S',
      onReady: function (selectedDates, dateStr, instance) {
        //console.log(selectedDates)
        if (instance.isMobile) {
          $(instance.mobileInput).attr('step', null);
        }
      },
      onChange: function (selectedDates) {
        var _this = this;
        var dateArr = selectedDates.map(function (date) { return _this.formatDate(date, 'Y-m-d H:i:S'); });
        startDate.val(dateArr[0]);
        endDate.val(dateArr[1]);
      },
    });
  }
  if (startDate.length) {
    var start = startDate.flatpickr({
      /// mode: 'range',
      enableTime: true,
      altFormat: 'Y-m-d H:i:S',
      onReady: function (selectedDates, dateStr, instance) {
        if (instance.isMobile) {
          $(instance.mobileInput).attr('step', null);
        }
      },
    });
  }

  // End date picker
  if (endDate.length) {
    var end = endDate.flatpickr({
      enableTime: true,
      altFormat: 'Y-m-dTH:i:S',
      onReady: function (selectedDates, dateStr, instance) {
        if (instance.isMobile) {
          $(instance.mobileInput).attr('step', null);
        }
      }
    });
  }

  // Event click function
  function eventClick(info) {
    eventToUpdate = info.event;
    if (eventToUpdate.url) {
      info.jsEvent.preventDefault();
      /// window.open(eventToUpdate.url, '_blank');
    }
    //console.log(eventToUpdate)

    sidebar.modal('show');
    addEventBtn.addClass('d-none');
    cancelBtn.addClass('d-none');
    updateEventBtn.removeClass('d-none');
    btnDeleteEvent.removeClass('d-none');

    eventTitle.val(eventToUpdate.title);
    start.setDate(eventToUpdate.start, true, 'Y-m-d');
    ///eventToUpdate.allDay === true ? allDaySwitch.prop('checked', true) : allDaySwitch.prop('checked', false);
    eventToUpdate.end !== null
      ? end.setDate(eventToUpdate.end, true, 'Y-m-d')
      : end.setDate(eventToUpdate.start, true, 'Y-m-d');
    //let grupoLabel = (eventToUpdate.extendedProps.calendar).replace('g', '')
    ///sidebar.find(eventLabel).val(grupoLabel).trigger('change');
    rangePickr.val(`${startDate.val()} to ${endDate.val()}`);
    $('#pkIdProgramaUsuario').val(eventToUpdate.id);
    eventToUpdate.extendedProps.programaGlobalId !== null ? $('#programaGlobalId').val(eventToUpdate.extendedProps.programaGlobalId) : null
    eventToUpdate.extendedProps.p_isGlobal !== 0 ? $('#p_isGlobal').val(eventToUpdate.extendedProps.p_isGlobal) : null
    rangePickr.flatpickr({
      mode: 'range',
      enableTime: true,
      altFormat: 'Y-m-d H:i:S',
      defaultDate: [startDate.val(), endDate.val()],
      onChange: function (selectedDates) {
        var _this = this;
        var dateArr = selectedDates.map(function (date) { return _this.formatDate(date, 'Y-m-d H:i:S'); });
        startDate.val(dateArr[0]);
        endDate.val(dateArr[1]);
      },
    });
    
    //eventToUpdate.extendedProps.guests !== undefined
    calendarEditor.html(eventToUpdate.extendedProps.description)
    /// : null;

    //  Delete Event
    btnDeleteEvent.on('click', function () {
      eventToUpdate.remove();
      // removeEvent(eventToUpdate.id);
      sidebar.modal('hide');
      $('.event-sidebar').removeClass('show');
      $('.app-calendar .body-content-overlay').removeClass('show');
    });
  }

  // Modify sidebar toggler
  function modifyToggler() {
    $('.fc-sidebarToggle-button')
      .empty()
      .append(feather.icons['menu'].toSvg({ class: 'ficon' }));

  }

  // Selected Checkboxes
  function selectedCalendars() {
    var selected = [];
    $('.calendar-events-filter input:checked').each(function () {
      selected.push($(this).attr('data-value'));
    });
    return selected;
  }

  // --------------------------------------------------------------------------------------------------
  // AXIOS: fetchEvents
  // * This will be called by fullCalendar to fetch events. Also this can be used to refetch events.
  // --------------------------------------------------------------------------------------------------
  async function fetchEvents(info, successCallback) {
    console.log(events);
    if (!events || events.length == 0) {
      await getPlanEntrenamientoUsuario();
    }
    var calendars = selectedCalendars();
    
      selectedEvents = events.filter(function (event) {
      return calendars.includes(event.extendedProps.calendar.toLowerCase());
    });
    successCallback(selectedEvents);
  }

  var initialLocaleCode = 'es';
  // Calendar plugins
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: fetchEvents,
    editable: true,
    locale: initialLocaleCode,
    dragScroll: true,
    dayMaxEvents: 2,
    eventResizableFromStart: true,
    customButtons: {
      sidebarToggle: {
        text: 'Sidebar'
      }
    },
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      ///end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    direction: direction,
    initialDate: new Date(),
    navLinks: true, // can click day/week names to navigate views
    eventClassNames: function ({ event: calendarEvent }) {
      ///const colorName = calendarEvent._def.extendedProps.color;
      return [
        // Background Color
        'bg-light-success'
      ];
    },
    dateClick: function (info) {
      var date = moment(info.date).format('YYYY-MM-DD');
      resetValues();
      sidebar.modal('show');
      addEventBtn.removeClass('d-none');
      updateEventBtn.addClass('d-none');
      btnDeleteEvent.addClass('d-none');
      startDate.val(date);
      endDate.val(date);
    },
    eventClick: function (info) {
      eventClick(info);
    },
    datesSet: function () {
      modifyToggler();
    },
    viewDidMount: function (info) {
      modifyToggler();

    },
    eventDrop: function (info) {
      console.log(info)
      let fechaStart = moment(info.event.start).format("YYYY-MM-DD HH:mm:ss");
      let fechaEnd = moment(info.event.end).format("YYYY-MM-DD HH:mm:ss");
      const data = new FormData();
      data.append("pkIdProgramaUsuario", info.event.id);
      data.append("fechaStart", fechaStart);
      data.append("fechaEnd", fechaEnd);
      $.ajax({
        url: `/updateProgramaUsuarioDrop`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {
          console.log(data)
          console.log(info.event.id)
          var existingEvent0 = calendar.getEventById(info.event.id);
          existingEvent0.setDates(fechaStart, fechaEnd);
          events.map(function(dato){
            if(dato.id == info.event.id){
              dato.start = fechaStart
          dato.end = fechaEnd           
          }
          })
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
    },
  });

  // Render calendar
  calendar.render();
  // Modify sidebar toggler
  modifyToggler();
  // updateEventClass();

  // Validate add new and update form
  if (eventForm.length) {
    eventForm.validate({
      errorClass: 'error',
      rules: {
        'tituloPrograma': {
          required: true
        },
        'fechaPlanEntrenamiento': {
          required: true
        },
      }
    });
  }

  // Sidebar Toggle Btn
  if (toggleSidebarBtn.length) {
    toggleSidebarBtn.on('click', function () {
      cancelBtn.removeClass('d-none');
    });
  }

  // ------------------------------------------------
  // addEvent
  // ------------------------------------------------
  function addEvent(eventData) {
    calendar.addEvent(eventData);
    calendar.refetchEvents();
  }

  // ------------------------------------------------
  // updateEvent
  // ------------------------------------------------
  function updateEvent(eventData) {
    var propsToUpdate = ['id', 'title'];
    var extendedPropsToUpdate = ['color', 'calendar', 'programaGlobalId', 'description', 'p_isGlobal'];

    updateEventInCalendar(eventData, propsToUpdate, extendedPropsToUpdate);
  }

  // ------------------------------------------------
  // removeEvent
  // ------------------------------------------------
  function removeEvent(eventId) {
    removeEventInCalendar(eventId);
  }

  // ------------------------------------------------
  // (UI) updateEventInCalendar
  // ------------------------------------------------
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    const existingEvent = calendar.getEventById(updatedEventData.id);

    // --- Set event properties except date related ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setProp
    // dateRelatedProps => ['start', 'end', 'allDay']
    // eslint-disable-next-line no-plusplus
    for (var index = 0; index < propsToUpdate.length; index++) {
      var propName = propsToUpdate[index];
      existingEvent.setProp(propName, updatedEventData[propName]);
    }

    // --- Set date related props ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay });

    // --- Set event's extendedProps ----- //
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    // eslint-disable-next-line no-plusplus
    for (var index = 0; index < extendedPropsToUpdate.length; index++) {
      var propName = extendedPropsToUpdate[index];
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName]);
    }
  };

  // ------------------------------------------------
  // (UI) removeEventInCalendar
  // ------------------------------------------------
  function removeEventInCalendar(eventId) {
    calendar.getEventById(eventId).remove();
  }

  // Add new event
  addEventBtn.on('click', function (e) {
    var isValid = formPlanEntrenamiento.valid();         
    e.preventDefault();
    let formArray = formPlanEntrenamiento.serializeArray();
    console.log(formArray)
    if (isValid) {
      var newEvent = {
        id: calendar.getEvents().length + 1,
        title: eventTitle.val(),
        start: startDate.val(),
        end: endDate.val(),
        startStr: startDate.val(),
        endStr: endDate.val(),
        display: 'block',
        extendedProps: {
          color: 'success',
          calendar: '1',
          description: calendarEditor.html(),
          fkIdUsuario: $('#fkIdUsuario').val(),
          p_isGlobal: $('#p_isGlobal').val()
        },
      };
      if ($('#programaGlobalId').val() !=='') {
        newEvent.extendedProps.programaGlobalId= $('#programaGlobalId').val();        
      }
      
      const data = new FormData();
      //data.append("pkIdEvento", info.event.id);
      $.ajax({
        url: `/createProgramaUsuario`,
        type: 'POST',
        data: newEvent,
        //cache: false,
        ////contentType: false,
        ///processData: false,
        success: function (data, textStatus, jqXHR) {
          console.log(data)
          newEvent.id = data.newProgramaUsuario[0];
          newEvent.extendedProps.programaGlobalId= data.fkIdPrograma;
          addEvent(newEvent);
          sidebar.modal('hide');
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });

    }
  });

  // Update new event
  updateEventBtn.on('click', function () {
    var isValid = formPlanEntrenamiento.valid();         
    console.log(eventToUpdate)
    if (eventForm.valid()) {
      var eventData = {
        id: eventToUpdate.id,
        title: eventTitle.val(),
        start: startDate.val(),
        end: endDate.val(),
        startStr: startDate.val(),
        endStr: endDate.val(),
        display: 'block',
        extendedProps: {
          color: 'success',
          calendar: '1',
          description: calendarEditor.html(),
          fkIdUsuario: $('#fkIdUsuario').val(),
          p_isGlobal: $('#p_isGlobal').val()
        },
      };
      if ($('#programaGlobalId').val() !=='') {
        eventData.extendedProps.programaGlobalId= $('#programaGlobalId').val();        
      }
      console.log(eventData)
      $.ajax({
        url: `/updateProgramaUsuario`,
        type: 'POST',
        data: eventData,
        //cache: false,
        ////contentType: false,
        ///processData: false,
        success: function (data, textStatus, jqXHR) {
          
          updateEvent(eventData);
          sidebar.modal('hide');
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });

    }
  });

  // Reset sidebar input values
  function resetValues() {
    endDate.val('');
    startDate.val('');
    eventTitle.val('');
    $('#pkIdProgramaUsuario').val('');
    $('#programaGlobalId').val('');
    allDaySwitch.prop('checked', false);
    $('#categoriasPrograma').val('').trigger('change');
    calendarEditor.html('');
    rangePickr.val('');
  }

  // When modal hides reset input values
  sidebar.on('hidden.bs.modal', function () {
    resetValues();
  });

  // Hide left sidebar if the right sidebar is open
  $('.btn-toggle-sidebar').on('click', function () {
    btnDeleteEvent.addClass('d-none');
    updateEventBtn.addClass('d-none');
    addEventBtn.removeClass('d-none');
    $('.app-calendar-sidebar, .body-content-overlay').removeClass('show');

  });

  // Select all & filter functionality
  if (selectAll.length) {
    selectAll.on('change', function () {
      var $this = $(this);

      if ($this.prop('checked')) {
        calEventFilter.find('input').prop('checked', true);
      } else {
        calEventFilter.find('input').prop('checked', false);
      }
      calendar.refetchEvents();
    });
  }

  if (filterInput.length) {
    filterInput.on('change', function () {
      $('.input-filter:checked').length < calEventFilter.find('input').length
        ? selectAll.prop('checked', false)
        : selectAll.prop('checked', true);
      calendar.refetchEvents();
    });
  }
});
