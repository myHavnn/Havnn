const { onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { google } = require("googleapis");
const { ScheduleGoogleMeetMeeting } = require("../../utils");

const serviceAccount = "../../youth-power-app-e1a0f42f7d94.json";

module.exports = onCall({ cors: true, invoker: "public" }, async (request) => {
  try {
    const { data } = request;
    logger.log("request ====>", request);
    const { subject, attendees, startDateTime, endDateTime } = data;

    const meetLink = await new ScheduleGoogleMeetMeeting({
      subject,
      attendees,
      calendarId: "admin@nodeeight.com",
      startDateTime,
      endDateTime,
    }).createCalendarMeetingAndGoogleMeetLink();

    logger.log("Google Meet Link:", meetLink);
    return {
      response:
        "Successfully created a new Google Calendar event and Google Meet link",
      status: true,
    };
  } catch (error) {
    logger.error(error);
    return {
      response: error.message,
      status: false,
    };
  }
});
