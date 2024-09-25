import React, { useState, useEffect } from "react";
import LineChart from './LineChart';
import axios from 'axios';

const LineChartParent = () => {
    const [checkInData, setCheckInData] = useState([]);
    const [checkOutData, setCheckOutData] = useState([]);
    const convertTimeToSeconds = (time) => {
        const [hours, minutes, seconds] = time.split(/[:\s]/).map(Number);
        const amPm = time.split(' ')[1];
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (amPm === "PM" && hours !== 12) totalSeconds += 12 * 3600;
        if (amPm === "AM" && hours === 12) totalSeconds -= 12 * 3600;
        return totalSeconds;
      };
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
            end: new Date(entry.end),
            checkInSeconds: convertTimeToSeconds(entry.checkIn),
            checkOutSeconds: convertTimeToSeconds(entry.checkOut)
          }));
      
          const checkIn = events.map(event => ({
            x: event.date,
            y: event.checkInSeconds
          }));
      
          const checkOut = events.map(event => ({
            x: event.date,
            y: event.checkOutSeconds
          }));
      
          setCheckInData(checkIn);
          setCheckOutData(checkOut);
        } catch (e) {
          console.log(e);
        }
      };
      
      useEffect(() => {
        getEntries();
      }, []);
      const data = [
        {
          id: "Check In",
          data: checkInData
        },
        {
          id: "Check Out",
          data: checkOutData
        }
      ];
    
    
    return (
        <div>

            <LineChart data={data} />
        </div>
    );
};

export default LineChartParent;
