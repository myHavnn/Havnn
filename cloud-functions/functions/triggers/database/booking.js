const admin = require("firebase-admin");
const {
  onDocumentCreated,
  onDocumentWritten,
} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const { ScheduleGoogleMeetMeeting } = require("../../utils");
const { format, addMinutes } = require("date-fns");

exports.newBooking = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    try {
      const firestore = admin.firestore;
      const appointmentId = event.params.appointmentId;
      const snapshot = event.data;
      if (!snapshot) {
        console.log("No data associated with the event");
        return;
      }
      //   const appointmentData = event.data.after.data();
      const appointmentData = snapshot.data();

      logger.log(`appointmentData ===>`, appointmentData);

      const {
        creatorName,
        creatorEmail,
        email,
        name,
        selectedDate,
        selectedTime,
        sessionLength,
        title,
        notes,
        gender,
        phone,
      } = appointmentData;

      const start = new Date(
        selectedDate?.toDate().toISOString().split("T")[0] + "T" + selectedTime
      );
      const end = new Date(addMinutes(start, sessionLength));
      const description = `Appointment between ${name} and ${creatorName}\n Gender: ${gender}\n Phone: ${phone}\n Notes: ${notes}`;

      const payload = {
        attendees: [
          {
            email: creatorEmail,
            displayName: creatorName,
          },
          {
            email: email,
            displayName: name,
          },
        ],
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        description,
        requestId: appointmentId,
        summary: title,
      };

      logger.log("payload ====>", payload);

      const scheduleMeeting = new ScheduleGoogleMeetMeeting(payload);
      const meetLink =
        await scheduleMeeting.createCalendarMeetingAndGoogleMeetLink();

      logger.log("Google Meet Link:", meetLink);

      await firestore().collection("appointments").doc(appointmentId).update({
        meetLink,
      });

      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
);
