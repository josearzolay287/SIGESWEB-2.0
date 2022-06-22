/**
 * App Calendar Events
 */

'use strict';
var eventos;
var date, nextDay,nextMonth,prevMonth,events = [], startDate, endDate, grupos;
async function getPlanEntrenamientoUsuario() {
  let fkIdUsuario = $('#fkIdUsuario').val();
  eventos = await fetch('/getPlanEntrenamientoUsuario/'+fkIdUsuario)
  .then((response) => response.json())
  .then((data) => {
    return data.ProgramaUsuario;
  });
  console.log(eventos)
  setEvents()
}
$(function() {
  ///getEventosGimnasio();
})

async function setEvents() {
 let allDayB = false;
 let grupo;
 let color;
  for (let i = 0; i < eventos.length; i++) {
date = new Date(eventos[i]['fechaInicial']);
endDate = eventos[i]['fechaFinal']
 nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// prettier-ignore
 nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
// prettier-ignore
 prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1); 

  events.push({id: eventos[i]['pkIdProgramaUsuario'],
      title: eventos[i]['titulo'],
      start: moment(date).format('YYYY-MM-DD HH:mm:ss'),//new Date(date.getFullYear(), date.getMonth() + 1, -11),
      end: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),///new Date(date.getFullYear(), date.getMonth() + 1, -10),
      allDay: false,
      extendedProps: {
        color: 'success',
        calendar: "g"+eventos[i]['estado'],
        programaGlobalId: eventos[i]['fkIdPrograma'],
        description: eventos[i]['descripcion'],
        p_isGlobal: eventos[i]['isGlobal']
      },
    })   
    
  }
}
