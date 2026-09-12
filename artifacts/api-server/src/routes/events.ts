import { Router, type IRouter, type Request } from "express";
import {
  CheckInAttendeeBody,
  CheckInAttendeeParams,
  CheckInAttendeeResponse,
  CreateEventBody,
  CreateEventResponse,
  GetEventParams,
  GetEventResponse,
  GetEventSummaryParams,
  GetEventSummaryResponse,
  ImportAttendeesBody,
  ImportAttendeesParams,
  ImportAttendeesResponse,
  ListAttendeesParams,
  ListAttendeesResponse,
  SendFinalReportParams,
  SendFinalReportResponse,
} from "@workspace/api-zod";
import {
  createEvent,
  getAttendees,
  getEvent,
  importAttendees,
  normalizeEmail,
  saveAttendees,
  deleteExpiredEvents,
  listEventIds,
  saveEvent,
  serializeFinalReport,
  type EventRecord,
} from "../lib/event-store";
import { sendCouponEmail, sendFinalReportEmail } from "../lib/email";

const router: IRouter = Router();

function publicEvent(
  req: Request,
  event: EventRecord,
  attendees: Awaited<ReturnType<typeof getAttendees>>,
) {
  const checkedInCount = attendees.filter((attendee) => attendee.checkedIn).length;
  const forwardedProtocol = req.get("x-forwarded-proto");
  const protocol = forwardedProtocol?.split(",")[0] ?? req.protocol;
  const host = req.get("host") ?? "localhost";

  return {
    id: event.id,
    name: event.name,
    eventDate: event.eventDate,
    dataDeleteDate: event.dataDeleteDate,
    attendeeCount: attendees.length,
    checkedInCount,
    checkInUrl: `${protocol}://${host}/check-in/${event.id}`,
  };
}

function notFound(res: Parameters<Parameters<IRouter["get"]>[1]>[1]) {
  res.status(404).json({ error: "Event not found or its data has been deleted." });
}

async function sendFinalReport(eventId: string) {
  const [event, attendees] = await Promise.all([
    getEvent(eventId, false),
    getAttendees(eventId),
  ]);
  const checkedIn = attendees.filter((attendee) => attendee.checkedIn).length;
  const result = {
    sent: false,
    total: attendees.length,
    checkedIn,
    didNotShow: attendees.length - checkedIn,
  };
  if (event.finalReportSentAt) return result;

  await sendFinalReportEmail({
    to: event.organizerEmail,
    eventName: event.name,
    total: result.total,
    checkedIn: result.checkedIn,
    didNotShow: result.didNotShow,
    csv: serializeFinalReport(attendees),
  });
  event.finalReportSentAt = new Date().toISOString();
  await saveEvent(event);
  return { ...result, sent: true };
}

async function sendDueFinalReports() {
  const today = new Date().toISOString().slice(0, 10);
  for (const eventId of await listEventIds()) {
    try {
      const event = await getEvent(eventId, false);
      if (event.eventDate < today && !event.finalReportSentAt) {
        await sendFinalReport(eventId);
      }
    } catch {
      // A failed report remains unsent and will be retried on the next run.
    }
  }
  await deleteExpiredEvents();
}

router.post("/events", async (req, res) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter a valid event name and dates." });
    return;
  }
  if (parsed.data.dataDeleteDate < parsed.data.eventDate) {
    res
      .status(400)
      .json({ error: "The data deletion date must be on or after the event date." });
    return;
  }

  const event = await createEvent(parsed.data);
  const response = CreateEventResponse.parse(publicEvent(req, event, []));
  res.status(201).json(response);
});

router.get("/events/:eventId", async (req, res) => {
  const params = GetEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid event link." });
    return;
  }
  try {
    const [event, attendees] = await Promise.all([
      getEvent(params.data.eventId),
      getAttendees(params.data.eventId),
    ]);
    res.json(GetEventResponse.parse(publicEvent(req, event, attendees)));
  } catch {
    notFound(res);
  }
});

router.post("/events/:eventId/import", async (req, res) => {
  const params = ImportAttendeesParams.safeParse(req.params);
  const body = ImportAttendeesBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Upload a valid CSV with email and coupon_code." });
    return;
  }
  try {
    const result = await importAttendees(
      params.data.eventId,
      body.data.attendees,
    );
    res.json(ImportAttendeesResponse.parse(result));
  } catch {
    notFound(res);
  }
});

router.get("/events/:eventId/summary", async (req, res) => {
  const params = GetEventSummaryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid event link." });
    return;
  }
  try {
    const attendees = await getAttendees(params.data.eventId);
    const checkedIn = attendees.filter((attendee) => attendee.checkedIn).length;
    res.json(
      GetEventSummaryResponse.parse({
        total: attendees.length,
        checkedIn,
        remaining: attendees.length - checkedIn,
        emailSent: attendees.filter((attendee) => attendee.emailSent).length,
      }),
    );
  } catch {
    notFound(res);
  }
});

router.get("/events/:eventId/attendees", async (req, res) => {
  const params = ListAttendeesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid event link." });
    return;
  }
  try {
    const attendees = await getAttendees(params.data.eventId);
    res.json(
      ListAttendeesResponse.parse(
        attendees.map(({ name, email, checkedIn, checkedInAt, emailSent }) => ({
          name,
          email,
          checkedIn,
          checkedInAt,
          emailSent,
        })),
      ),
    );
  } catch {
    notFound(res);
  }
});

router.post("/events/:eventId/final-report", async (req, res) => {
  const params = SendFinalReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid event link." });
    return;
  }
  try {
    const result = await sendFinalReport(params.data.eventId);
    res.json(SendFinalReportResponse.parse(result));
  } catch (error) {
    req.log.error({ err: error }, "Unable to send final attendance report");
    res.status(502).json({
      error: "The attendance report could not be emailed. Please try again.",
    });
  }
});

router.post("/events/:eventId/check-in", async (req, res) => {
  const params = CheckInAttendeeParams.safeParse(req.params);
  const body = CheckInAttendeeBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({
      error: "Enter the same valid email address you used to register.",
    });
    return;
  }

  try {
    const [event, attendees] = await Promise.all([
      getEvent(params.data.eventId),
      getAttendees(params.data.eventId),
    ]);
    const email = normalizeEmail(body.data.email);
    const attendee = attendees.find((item) => item.email === email);

    if (!attendee) {
      res.status(404).json({
        error:
          "We couldn't find this email in the registration list. Use the email address you registered with.",
      });
      return;
    }

    if (attendee.checkedIn) {
      res.json(
        CheckInAttendeeResponse.parse({
          status: "already_checked_in",
          message:
            "This email has already been checked in. Please check your inbox for your event resources.",
          emailSent: attendee.emailSent,
        }),
      );
      return;
    }

    await sendCouponEmail({
      to: attendee.email,
      attendeeName: attendee.name,
      eventName: event.name,
      couponCode: attendee.couponCode,
    });

    attendee.checkedIn = true;
    attendee.checkedInAt = new Date().toISOString();
    attendee.emailSent = true;
    await saveAttendees(params.data.eventId, attendees);

    res.json(
      CheckInAttendeeResponse.parse({
        status: "checked_in",
        message:
          "You're checked in. Your event resources and coupon code have been sent to your email.",
        emailSent: true,
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Unable to complete attendee check-in");
    res.status(502).json({
      error:
        "We found your registration but couldn't send the email. Please try again.",
    });
  }
});

void sendDueFinalReports();
setInterval(() => void sendDueFinalReports(), 60 * 60 * 1000).unref();

export default router;
