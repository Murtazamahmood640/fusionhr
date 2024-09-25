import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [totalMonthlyHours, setTotalMonthlyHours] = useState("0h : 0min : 0sec");

  useEffect(() => {
    getEntries();
  }, []);

  const getEntries = async () => {
    try {
      const res = await axios.get('https://a-khuhro-abidipro.mdbgo.io/api/timeEntries', {
        params: {
          email: localStorage.getItem('email')
        }
      });
      const events = res.data.map(entry => ({
        ...entry,
        start: new Date(entry.start),
        end: new Date(entry.end)
      }));
      setCurrentEvents(events);
      calculateMonthlyHours(events);
    } catch (e) {
      console.log(e);
    }
  };

  const calculateMonthlyHours = (events) => {
    const now = new Date();
    const currentMonthEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    });
    const totalSeconds = currentMonthEvents.reduce((acc, event) => {
      const duration = (new Date(event.end) - new Date(event.start)) / 1000;
      return acc + duration;
    }, 0);
    setTotalMonthlyHours(formatTime(totalSeconds));
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h : ${minutes}min : ${seconds}sec`;
  };

  const handleDateClick = async (selected) => {
    const title = prompt("Please enter a new title for your event");
    const email = prompt("Please enter the email address to send a reminder");
    const time = prompt("Please enter the time (HH:mm) for the event");
  
    const calendarApi = selected.view.calendar;
    calendarApi.unselect(); // Clear date selection
  
    if (title && email && time) {
      const startTime = new Date(selected.startStr);
      const [hours, minutes] = time.split(":");
      startTime.setHours(hours, minutes);
  
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: startTime,
        end: startTime,
        allDay: false,
      });
  
      try {
        await axios.post('https://a-khuhro-abidipro.mdbgo.io/api/scheduleEvent/sendMail', {
          email,
          subject: 'Event Reminder',
          message: `Your event "${title}" is scheduled for ${startTime}.`,
          eventTime: startTime,
        });
        toast.success("Event scheduled and email will be sent!");
      } catch (error) {
        console.error("Error scheduling email:", error);
        toast.error("Failed to schedule email.");
      }
    }
  };
  

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />
      <Typography variant="h5">Total Monthly Hours: {totalMonthlyHours}</Typography>
      <Box display="flex" justifyContent="space-between">
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            events={currentEvents}
            eventColor="#378006" // Example of changing the background color of events
          />
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default Calendar;
