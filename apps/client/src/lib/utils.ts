import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { createEvents, EventAttributes } from 'ics';

import { format, differenceInMinutes } from 'date-fns';




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  label?: string;
  location?: string;
}

export async function downloadIcsFile(events: CalendarEvent[]) {
  const icsEvents = events.map((evt) => {
    const startDate = format(evt.start, 'yyyy-M-d-H-m')
      .split('-')
      .map((a) => parseInt(a, 10));

    const totalMinutes = differenceInMinutes(evt.end, evt.start);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      title: evt.title,
      description: evt.description || '',
      location: evt.location || '',
      start: startDate,
      duration: { hours, minutes },
    };
  });

  const { error, value } = createEvents(icsEvents as EventAttributes[]);

  if (error || !value) {
    console.error('ICS generation error:', error);
    throw new Error('Failed to generate ICS file');
  }


  const filename = 'events.ics';
  const file = new File([value], filename, { type: 'text/calendar' });
  const url = URL.createObjectURL(file);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
};
