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
$(function () {
  //$('#select-all').trigger('click');
})
async function getgrupos() {
  gruposFiltro = await fetch("/getgruposGimnasio")
    .then((response) => response.json())
    .then((data) => {
      return data.gruposList;
    });
  console.log(gruposFiltro);
  for (let i = 0; i < gruposFiltro.length; i++) {
    calendarsColor[`g${gruposFiltro[i]['pkIdGrupoGimnasio']}`] = 'primary';
  }
  console.log(calendarsColor);
}
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
    eventForm = $('.event-form'),
    addEventBtn = $('.add-event-btn'),
    cancelBtn = $('.btn-cancel'),
    updateEventBtn = $('.update-event-btn'),
    toggleSidebarBtn = $('.btn-toggle-sidebar'),
    eventTitle = $('#title'),
    eventLabel = $('#select-label'),
    startDate = $('#start-date'),
    rangePickr = $('.flatpickr-range'),
    endDate = $('#end-date'),
    eventUrl = $('#event-url'),
    ///eventGuests = $('#event-guests'),
    ///eventLocation = $('#event-location'),
    ///allDaySwitch = $('.allDay-switch'),
    selectAll = $('.select-all'),
    calEventFilter = $('.calendar-events-filter'),
    filterInput = $('.input-filter'),
    btnDeleteEvent = $('.btn-delete-event'),
    calendarEditor = $('#event-description-editor'),
    entrenador = $('#entrenador'),
    precio = $('#precio'),
    espacios = $('#espacios'),
    repetir = $('#repetir'),
    //gruposPermitidos = $('#gruposPermitidos'),
    color = $('#color');

  // --------------------------------------------
  // On add new item, clear sidebar-right field fields
  // --------------------------------------------
  $('.add-event button').on('click', function (e) {
    $('.event-sidebar').addClass('show');
    $('.sidebar-left').removeClass('show');
    $('.app-calendar .body-content-overlay').addClass('show');
  });

  // Label  select
  if (eventLabel.length) {
    function renderBullets(option) {
      if (!option.id) {
        return option.text;
      }
      var $bullet =
        "<span class='bullet bullet-" +
        $(option.element).data('label') +
        " bullet-sm me-50'> " +
        '</span>' +
        option.text;
      return $bullet;

    }

    eventLabel.wrap('<div class="position-relative"></div>').select2({
      placeholder: 'Select value',
      dropdownParent: eventLabel.parent(),
      templateResult: renderBullets,
      templateSelection: renderBullets,
      minimumResultsForSearch: -1,
      escapeMarkup: function (es) {
        return es;
      }
    });
  }

   // Start date picker
  if (rangePickr.length) {
    rangePickr.flatpickr({
      mode: 'range',
      enableTime: true,
      altFormat: 'Y-m-d H:i:S',
      onReady: function (selectedDates, dateStr, instance) {
        console.log(selectedDates)
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
    console.log(eventToUpdate)

    sidebar.modal('show');
    addEventBtn.addClass('d-none');
    cancelBtn.addClass('d-none');
    updateEventBtn.removeClass('d-none');
    btnDeleteEvent.removeClass('d-none');

    eventTitle.val(eventToUpdate.title);
    start.setDate(eventToUpdate.start, true, 'Y-m-d');
    eventToUpdate.extendedProps.repetirSemanal === 'S' ? repetir.prop('checked', true) : repetir.prop('checked', false);
    eventToUpdate.end !== null
      ? end.setDate(eventToUpdate.end, true, 'Y-m-d')
      : end.setDate(eventToUpdate.start, true, 'Y-m-d');
    let grupoLabel = (eventToUpdate.extendedProps.calendar).replace('g', '')
    sidebar.find(eventLabel).val(grupoLabel).trigger('change');
    startDate.val(moment(eventToUpdate.start).format('YYYY-MM-DD H:mm:ss'));
    endDate.val(moment(eventToUpdate.end).format('YYYY-MM-DD H:mm:ss'));

    rangePickr.flatpickr({
      mode: 'range',
      enableTime: true,
      altFormat: 'Y-m-d H:i:S',
      defaultDate: [eventToUpdate.start, eventToUpdate.end],
      onChange: function (selectedDates) {
        var _this = this;
        var dateArr = selectedDates.map(function (date) { return _this.formatDate(date, 'Y-m-d H:i:S'); });
        startDate.val(dateArr[0]);
        endDate.val(dateArr[1]);
      },
    });
    entrenador.val(eventToUpdate.extendedProps.entrenador)
    precio.val(eventToUpdate.extendedProps.precio)
    espacios.val(eventToUpdate.extendedProps.espacios)
    color.val(eventToUpdate.extendedProps.color).trigger('change')
    //eventToUpdate.extendedProps.guests !== undefined
    calendarEditor.val(eventToUpdate.extendedProps.description)
    /// : null;

    //  Delete Event
    btnDeleteEvent.on('click', function () {
     // eventToUpdate.remove();
     Swal.fire({
      title: 'Seguro?',
      text: "Seguro desea eliminar este evento? Luego no podrá restablecerlo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        removeEvent(eventToUpdate.id);
          sidebar.modal('hide');
      $('.event-sidebar').removeClass('show');
      $('.app-calendar .body-content-overlay').removeClass('show');
      }
    })
     
    
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
    // Fetch Events from API endpoint reference
    /* $.ajax(
      {
        url: '../../../app-assets/data/app-calendar-events.js',
        type: 'GET',
        success: function (result) {
          // Get requested calendars as Array
          var calendars = selectedCalendars();

          return [result.events.filter(event => calendars.includes(event.extendedProps.calendar))];
        },
        error: function (error) {
          console.log(error);
        }
      }
    ); */
 console.log(events);
    if (events.length == 0) {
      console.log('here in 1fir')
      await getEventosGimnasio();
      await getgrupos();
    }
   
    var calendars = selectedCalendars();
    // We are reading event object from app-calendar-events.js file directly by including that file above app-calendar file.
    // You should make an API call, look into above commented API call for reference
    selectedEvents = events.filter(function (event) {
      return calendars.includes(event.extendedProps.calendar.toLowerCase());
    });
    ///if (selectedEvents.length > 0) {
    successCallback(selectedEvents);
    /// }
  }

  var initialLocaleCode = 'es';
  // Calendar plugins
  var calendar = new FullCalendar.Calendar(calendarEl, {
    ///timeZone: 'GMT',
    initialView: 'dayGridMonth',
    events: fetchEvents,
    editable: true,
    locale: initialLocaleCode,
    dragScroll: true,
    dayMaxEvents: 3,
    eventResizableFromStart: true,
    customButtons: {
      sidebarToggle: {
        text: 'Sidebar'
      }
    },
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    direction: direction,
    initialDate: new Date(),
    navLinks: true, // can click day/week names to navigate views
    eventClassNames: function ({ event: calendarEvent }) {
      var colorName //= calendarEvent._def.extendedProps.color;
      switch (calendarEvent._def.extendedProps.color) {
        case '#005C7C':
          colorName = 'primary'
          break;
        case 'Amarillo':
          colorName = 'warning'
          break;
        case '#202125':
          colorName = 'info'
          break;
        case 'Verde Claro':
          colorName = 'success'
          break;
          case 'Rojo':
            colorName = 'danger'
            break;
        default:
          colorName = calendarEvent._def.extendedProps.color
          break;
      }
      return [
        // Background Color
        'bg-light-' + colorName
      ];
    },
    dateClick: function (info) {
      console.log(info.date)
      var date = moment(info.date).format('YYYY-MM-DD');
      resetValues();
      sidebar.modal('show');
      addEventBtn.removeClass('d-none');
      updateEventBtn.addClass('d-none');
      btnDeleteEvent.addClass('d-none');
      startDate.val(date);
      endDate.val(date);
      rangePickr.flatpickr({
        mode: 'range',
        enableTime: true,
        altFormat: 'Y-m-d H:i:S',
        defaultDate: [date,date],
        onChange: function (selectedDates) {
          var _this = this;
          var dateArr = selectedDates.map(function (date) { return _this.formatDate(date, 'Y-m-d H:i:S'); });
          startDate.val(dateArr[0]);
          endDate.val(dateArr[1]);
        },
      });
      console.log(startDate.val())
      console.log(endDate.val())
    },
    eventClick: function (info) {
      console.log(info)
      eventClick(info);
    },
    datesSet: function () {
      modifyToggler();
    },
    viewDidMount: function () {
      modifyToggler();
    },
    eventDrop: function (info) {
      console.log(info.event);
      let fechaStart = moment(info.event.start).format("YYYY-MM-DD HH:mm:ss");
      let fechaEnd = moment(info.event.end).format("YYYY-MM-DD HH:mm:ss");
      console.log(fechaStart);
      console.log(fechaEnd);
      const data = new FormData();
      data.append("pkIdEvento", info.event.id);
      data.append("fechaStart", fechaStart);
      data.append("fechaEnd", fechaEnd);
      $.ajax({
        url: `/updateDateStartEvent`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {
          console.log(data);
          if (data.eventosD[0]>0) {
            Swal.fire(
              'Éxito!',
              'Fecha de evento cambiada con éxito.',
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Ocurrio un error al cambiar la fecha del evento.',
              'danger'
            ) 
          }
          
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
      submitHandler: function (form, event) {
        event.preventDefault();
        if (eventForm.valid()) {
          sidebar.modal('hide');
        }
      },
      rules: {
        'entrenador': { required: true },
        'title': { required: true },
        'range_fecha': { required: true },
      },
      messages: {
        'range_fecha': { required: 'Start and End Date is required' },
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
  async function addEvent(eventData) {
    calendar.addEvent(eventData);
    calendar.refetchEvents();
  }

  // ------------------------------------------------
  // updateEvent
  // ------------------------------------------------
  function updateEvent(eventData) {
    var propsToUpdate = ['id', 'title', 'url'];
    var extendedPropsToUpdate = ['color', 'calendar', 'description','entrenador', 'precio', 'espacios', 'fkIdGimnasio', 'notificacionEnviada'];
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
    const data = new FormData();

    data.append("pkIdEvento", parseInt(eventId));
    $.ajax({
      url: `/deleteCalendarEvent`,
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data, textStatus, jqXHR) {
        console.log(data);
        calendar.getEventById(eventId).remove();
        if (data.deleteEvent[0]>0) {
          Swal.fire(
            'Eliminado!',
            'Evento eliminado con éxito.',
            'success'
          )
        } else {
          Swal.fire(
            'Error!',
            'Ocurrio un error al eliminar el evento.',
            'danger'
          ) 
        }

      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
    
  }

  // Add new event
  $(addEventBtn).on('click', function () {
    if (eventForm.valid()) {
      var newEvent = {
        id: calendar.getEvents().length + 1,
        /// daysOfWeek: [0,1,2],//moment(startDate.val()).day() Dias que se va a repetir empezando por 0 -domingo hasta 6 sabado
        // startRecur: startDate.val(),//dia desde el que comienza a repetir
        // startTime: moment(startDate.val()).format('HH:mm:ss'),//hora de inicio de la recurrencia
        ///endTime: moment(endDate.val()).format('HH:mm:ss'),//fin de hora de recurrencia   
        //endRecur:  endDate.val()  // hasta que fecha de repetira, en caso de estar en blanco se repetira infinitamente
        title: eventTitle.val(),
        start: startDate.val(),
        end: endDate.val(),
        startStr: startDate.val(),
        endStr: endDate.val(),
        display: 'block',
        extendedProps: {
          color: color.val(),
          calendar: eventLabel.val(),
          description: calendarEditor.val(),
          /** */
          entrenador: entrenador.val(),
          precio: precio.val(),
          espacios: espacios.val(),
          fkIdGimnasio: '150',
          notificacionEnviada: '0'
        },
        repetir: 'N'
      };
      if (eventUrl.val().length) {
        newEvent.url = eventUrl.val();
      }
      if (repetir.is(':checked')) {
        newEvent.repetir = 'S';
      }
      console.log(newEvent)
      const data = new FormData();
      //data.append("pkIdEvento", info.event.id);
      $.ajax({
        url: `/createCalendarEvent`,
        type: 'POST',
        data: newEvent,
        //cache: false,
        ////contentType: false,
        ///processData: false,
        success: function (data, textStatus, jqXHR) {
          console.log(data.newEvent[0]);
          newEvent.id = data.newEvent[0];
          console.log(newEvent);
          if (data.newEvent[0]>0 && newEvent['repetir'] == 'S') {
            
            Swal.fire(
              'Éxito!',
              'El evento se creó en ciclo, esto significa que se crearon previamente 2 semanas, luego se seguirán creando automáticamente',
              'success'
            ).then((response)=>{
              // addEvent(newEvent);
              location.reload();
            })
          }else if (data.newEvent[0]>0 && newEvent['repetir'] == 'N') {
            addEvent(newEvent);
            Swal.fire(
              'Éxito!',
              'Evento creado con éxito.',
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Ocurrio un error al actualizar el evento.',
              'danger'
            ) 
          }
          
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });

    }
  });

  // Update new event
  updateEventBtn.on('click', function () {
    if (eventForm.valid()) {
      var eventData = {
        id: eventToUpdate.id,
        title: sidebar.find(eventTitle).val(),
        start: sidebar.find(startDate).val(),
        end: sidebar.find(endDate).val(),
        url: eventUrl.val(),
        extendedProps: {
          color: color.val(),
          calendar: eventLabel.val(),
          description: calendarEditor.val(),
           /** */
           entrenador: entrenador.val(),
           precio: precio.val(),
           espacios: espacios.val(),
           fkIdGimnasio: '150',
           notificacionEnviada: '0'
        },
        display: 'block',
        repetir: 'N',
      };
      if (repetir.is(':checked')) {
        eventData.repetir = 'S';
      }
      console.log(eventData)
      $.ajax({
        url: `/updateCalendarEvent`,
        type: 'POST',
        data: eventData,
        //cache: false,
        ////contentType: false,
        ///processData: false,
        success: function (data, textStatus, jqXHR) {
          console.log(data)
          if (data.newEvent[0]>0) {
            updateEvent(eventData);
            Swal.fire(
              'Éxito!',
              'Evento actualizado con éxito.',
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Ocurrio un error al actualizar el evento.',
              'danger'
            ) 
          }
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
    eventUrl.val('');
    startDate.val('');
    eventTitle.val('');
    // eventLocation.val('');
    ///allDaySwitch.prop('checked', false);
    // eventGuests.val('').trigger('change');
    eventLabel.val('').trigger('change')
    entrenador.val('');
    precio.val('');
    espacios.val('');
    repetir.val('');
    //gruposPermitidos.val('');
    color.val('');
    calendarEditor.val('');
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
