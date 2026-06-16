// src/services/googleCalendarService.ts
// Placeholder for future Google Calendar integration

/**
 * TODO: Google Calendar Integration (Phase 2)
 *
 * Required scopes to add to auth.ts:
 *   "https://www.googleapis.com/auth/calendar"
 *   "https://www.googleapis.com/auth/calendar.events"
 *
 * Required setup:
 *  1. Enable Google Calendar API in Google Cloud Console
 *  2. Add calendar scope to the Google OAuth provider in auth.ts
 *  3. Store the refresh_token from the Account model
 *  4. Use googleapis npm package to make API calls
 *
 * npm install googleapis
 */

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
}

/**
 * Create a Google Calendar event for a task.
 * @placeholder - Not yet implemented
 */
export async function createCalendarEvent(
  _accessToken: string,
  _event: GoogleCalendarEvent
): Promise<string | null> {
  console.warn("Google Calendar integration not yet implemented");
  return null;
}

/**
 * Update a Google Calendar event.
 * @placeholder - Not yet implemented
 */
export async function updateCalendarEvent(
  _accessToken: string,
  _eventId: string,
  _event: Partial<GoogleCalendarEvent>
): Promise<void> {
  console.warn("Google Calendar integration not yet implemented");
}

/**
 * Delete a Google Calendar event.
 * @placeholder - Not yet implemented
 */
export async function deleteCalendarEvent(
  _accessToken: string,
  _eventId: string
): Promise<void> {
  console.warn("Google Calendar integration not yet implemented");
}
