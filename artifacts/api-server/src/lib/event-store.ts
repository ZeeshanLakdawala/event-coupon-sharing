import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export type EventRecord = {
  id: string;
  name: string;
  organizerEmail: string;
  eventDate: string;
  dataDeleteDate: string;
  createdAt: string;
  finalReportSentAt?: string;
};

export type AttendeeRecord = {
  name: string;
  email: string;
  couponCode: string;
  checkedIn: boolean;
  checkedInAt: string | null;
  emailSent: boolean;
};

const dataRoot = path.resolve(process.cwd(), ".data", "event-coupon-checkin");
const attendeeHeader =
  "name,email,coupon_code,checked_in,checked_in_at,email_sent";

function eventDirectory(eventId: string) {
  if (!/^[a-z0-9-]+$/i.test(eventId)) {
    throw new Error("Invalid event ID");
  }
  return path.join(dataRoot, eventId);
}

function encodeCsvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      cells.push(value);
      value = "";
    } else {
      value += character;
    }
  }

  cells.push(value);
  return cells;
}

function serializeAttendees(attendees: AttendeeRecord[]) {
  const rows = attendees.map((attendee) =>
    [
      attendee.name,
      attendee.email,
      attendee.couponCode,
      String(attendee.checkedIn),
      attendee.checkedInAt ?? "",
      String(attendee.emailSent),
    ]
      .map(encodeCsvCell)
      .join(","),
  );
  return `${attendeeHeader}\n${rows.join("\n")}${rows.length ? "\n" : ""}`;
}

export function serializeFinalReport(attendees: AttendeeRecord[]) {
  const header = "name,email,coupon_code,status";
  const rows = attendees.map((attendee) =>
    [
      attendee.name,
      attendee.email,
      attendee.couponCode,
      attendee.checkedIn ? "Checked in" : "Did not show",
    ]
      .map(encodeCsvCell)
      .join(","),
  );
  return `${header}\n${rows.join("\n")}${rows.length ? "\n" : ""}`;
}

function parseAttendees(csv: string): AttendeeRecord[] {
  return csv
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const [name, email, couponCode, checkedIn, checkedInAt, emailSent] =
        parseCsvLine(line);
      return {
        name: name ?? "",
        email: email ?? "",
        couponCode: couponCode ?? "",
        checkedIn: checkedIn === "true",
        checkedInAt: checkedInAt || null,
        emailSent: emailSent === "true",
      };
    });
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function deleteExpiredEvents() {
  await mkdir(dataRoot, { recursive: true });
  const eventIds = await readdir(dataRoot);
  const today = new Date().toISOString().slice(0, 10);

  await Promise.all(
    eventIds.map(async (eventId) => {
      try {
        const event = await getEvent(eventId, false);
        if (event.dataDeleteDate < today) {
          await rm(eventDirectory(eventId), { recursive: true, force: true });
        }
      } catch {
        // Ignore incomplete folders so one bad import cannot block cleanup.
      }
    }),
  );
}

export async function createEvent(input: {
  name: string;
  organizerEmail: string;
  eventDate: string;
  dataDeleteDate: string;
}) {
  await deleteExpiredEvents();
  const event: EventRecord = {
    id: randomUUID().split("-")[0],
    name: input.name.trim(),
    organizerEmail: normalizeEmail(input.organizerEmail),
    eventDate: input.eventDate,
    dataDeleteDate: input.dataDeleteDate,
    createdAt: new Date().toISOString(),
  };
  const directory = eventDirectory(event.id);
  await mkdir(directory, { recursive: true });
  await Promise.all([
    writeFile(
      path.join(directory, "event.json"),
      JSON.stringify(event, null, 2),
      "utf8",
    ),
    writeFile(path.join(directory, "attendees.csv"), `${attendeeHeader}\n`, "utf8"),
  ]);
  return event;
}

export async function listEventIds() {
  await mkdir(dataRoot, { recursive: true });
  return readdir(dataRoot);
}

export async function saveEvent(event: EventRecord) {
  await writeFile(
    path.join(eventDirectory(event.id), "event.json"),
    JSON.stringify(event, null, 2),
    "utf8",
  );
}

export async function getEvent(eventId: string, runCleanup = true) {
  if (runCleanup) await deleteExpiredEvents();
  const contents = await readFile(
    path.join(eventDirectory(eventId), "event.json"),
    "utf8",
  );
  return JSON.parse(contents) as EventRecord;
}

export async function getAttendees(eventId: string) {
  await getEvent(eventId);
  const contents = await readFile(
    path.join(eventDirectory(eventId), "attendees.csv"),
    "utf8",
  );
  return parseAttendees(contents);
}

export async function saveAttendees(
  eventId: string,
  attendees: AttendeeRecord[],
) {
  await writeFile(
    path.join(eventDirectory(eventId), "attendees.csv"),
    serializeAttendees(attendees),
    "utf8",
  );
}

export async function importAttendees(
  eventId: string,
  rows: Array<{ name?: string; email: string; couponCode: string }>,
) {
  await getEvent(eventId);
  const seen = new Set<string>();
  const attendees: AttendeeRecord[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const email = normalizeEmail(row.email);
    if (!email || !email.includes("@") || !row.couponCode.trim()) {
      errors.push(`Row ${index + 2}: email and coupon_code are required.`);
      return;
    }
    if (seen.has(email)) {
      errors.push(`Row ${index + 2}: duplicate email ${email}.`);
      return;
    }
    seen.add(email);
    attendees.push({
      name: row.name?.trim() ?? "",
      email,
      couponCode: row.couponCode.trim(),
      checkedIn: false,
      checkedInAt: null,
      emailSent: false,
    });
  });

  await saveAttendees(eventId, attendees);
  return { imported: attendees.length, rejected: errors.length, errors };
}
