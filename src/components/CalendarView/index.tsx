import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('sonarr-url-here')
        .then((response) => response.json())
        .then((data) =>
          data.map((show: any) => ({
            title: show.title,
            start: new Date(show.airDateUtc),
            end: new Date(show.airDateUtc),
            source: 'sonarr', // Add source property
          }))
        ),
      fetch('radarr-url-here')
        .then((response) => response.json())
        .then((data) =>
          data.map((show: any) => ({
            title: show.title,
            start: new Date(show.digitalRelease), // Use digitalRelease for Radarr events
            end: new Date(show.digitalRelease),
            source: 'radarr', // Add source property
          }))
        ),
    ]).then(([sonarrEvents, radarrEvents]) => {
      setEvents([...sonarrEvents, ...radarrEvents]);
    });
  }, []);

  // ...

  return (
    <Calendar
      localizer={localizer}
      events={events}
      defaultView="week"
      style={{ height: 800 }}
      eventPropGetter={(event) => {
        if (event.source === 'sonarr') {
          return { style: { backgroundColor: 'blue' } };
        } else if (event.source === 'radarr') {
          return { style: { backgroundColor: 'red' } };
        }
      }}
    />
  );
};

export default CalendarView;
