import React, { useEffect, useState } from 'react';

const LiveChannelProgramGuide = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/schedule');
        const data = await response.json();
        setSchedule(data);
        console.log('Schedule:', data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div>
      <h2>Swayam Prabha Channel 5 Schedule</h2>
      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Time</th>
              <th>Subject</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.time}</td>
                <td>{item.subject}</td>
                <td>{item.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};



export default LiveChannelProgramGuide;
