const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Google Calendar setup
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  )
});

// Book a lesson
app.post('/api/book', async (req, res) => {
  try {
    const { startTime, studentName, studentEmail } = req.body;
    const startDate = new Date(startTime);
    const endDate = new Date(startTime);
    endDate.setMinutes(endDate.getMinutes() + 60); // 60-minute lesson

    const event = {
      summary: 'English Trial Lesson',
      description: `Trial lesson with ${studentName}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Prague',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Prague',
      },
      attendees: [
        { email: studentEmail }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
      conferenceData: {
        createRequest: {
          requestId: `lesson-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const booking = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event,
      sendUpdates: 'all',
      conferenceDataVersion: 1,
    });

    res.json({
      success: true,
      eventId: booking.data.id,
      meetLink: booking.data.hangoutLink,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create booking' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
