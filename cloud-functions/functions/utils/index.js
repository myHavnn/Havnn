const { google } = require("googleapis");
const path = require("path");
const logger = require("firebase-functions/logger");

class ScheduleGoogleMeetMeeting {
  /**
   * Generate New Google Calendar Event + related Google Meet Link
   *
   * @return {Promise<string>} Google Meet Link of the scheduled event
   */

  constructor({
    subject = "admin@nodeeight.com",
    attendees,
    calendarId = "admin@nodeeight.com",
    startDateTime,
    endDateTime,
    summary = "Meeting",
    requestId,
    description,
  }) {
    // Initiate API Client
    this.auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
    this.subject = subject;
    this.attendees = attendees;
    this.calendarId = calendarId;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.summary = summary;
    this.requestId = requestId;
    this.description = description;
  }

  async createCalendarMeetingAndGoogleMeetLink() {
    logger.log("Current Directory: ", __dirname);
    const serviceAccount = path.join(
      __dirname,
      "../youth-power-app-e1a0f42f7d94.json"
    );
    // Set up credentials for the Calendar API
    process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccount;

    const client = await this.auth.getClient();
    client.subject = this.subject;

    // Set up the Calendar API service
    const calendar = google.calendar({ version: "v3", auth: client });

    // Create a new event on Google Calendar
    const event = {
      summary: this.summary,
      description: this.description,
      start: {
        dateTime: this.startDateTime,
        timeZone: "Africa/Accra",
      },
      end: {
        dateTime: this.endDateTime,
        timeZone: "Africa/Accra",
      },
      attendees: this.attendees,
      conferenceData: {
        createRequest: {
          requestId: this.requestId,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    // Insert the event into the targeted Google Calendar
    const response = await calendar.events.insert({
      calendarId: this.calendarId,
      requestBody: event,
      conferenceDataVersion: 1, // To allow for Google Meet Link creation
      sendUpdates: "all",
    });

    // Retrieve the generated Google Meet link from the event's conference data
    return response.data.hangoutLink;
  }
}

exports.ScheduleGoogleMeetMeeting = ScheduleGoogleMeetMeeting;
