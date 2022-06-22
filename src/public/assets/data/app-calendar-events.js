/**
 * App Calendar Events
 */

'use strict';
var eventos;
var date, nextDay, nextMonth, prevMonth, events = [], startDate, endDate, grupos;
async function getEventosGimnasio() {
  eventos = await fetch('/getEventosGimnasio')
    .then((response) => response.json())
    .then((data) => {
      return data.eventosD;
    });
    console.log(eventos)
  getEventogrupos();

}
async function getEventogrupos() {
  grupos = await fetch("/getEventoGrupos")
    .then((response) => response.json())
    .then((data) => {
      return data.gruposList;
    });
  console.log(grupos);
  setEvents();
}
$(function () {
  ///getEventosGimnasio();
})

async function setEvents() {
  let allDayB = false;
  let grupo = 'g0';
  let color;
  
  for (let i = 0; i < eventos.length; i++) {
    for (let j = 0; j < grupos.length; j++) {
    if (grupos[j]['fkIdEvento'] == eventos[i]['pkIdEvento']) {  
      grupo = "g" + grupos[j]['pkIdGrupoGimnasio'];
    }
  }
    date = new Date(eventos[i]['fecha']);
    endDate = eventos[i]['fechaFin']
    nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    // prettier-ignore
    nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
    // prettier-ignore
    prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1);

    if (eventos[i]['todoElDia'] == 'S') {
      allDayB = true;
    }
    events.push({
      id: eventos[i]['pkIdEvento'],
      url: eventos[i]['link'],
      title: eventos[i]['nombre'],
      start:  eventos[i]['fecha'],
      end: eventos[i]['fechaFin'],
      extendedProps: {
        color: eventos[i]['color'],
        calendar: grupo,
        description: eventos[i]['descripcion'],
        repetirSemanal: eventos[i]['RecurrenceRule'],
        entrenador: eventos[i]['entrenador'],
        precio: eventos[i]['precio'],
        espacios: eventos[i]['espacios'],
        fkIdGimnasio: '150',
        notificacionEnviada: '0'
      },
    })
  }
  console.log(events)
}