import {
    EventCalendar,
    type CalendarEvent,
    // type EventColor,
} from "~/components/event-calendar";
import { addDays, setHours, setMinutes, getDay } from "date-fns";


// Function to calculate days until next Sunday
const getDaysUntilNextSunday = (date: Date) => {
    const day = getDay(date); // 0 is Sunday, 6 is Saturday
    return day === 0 ? 0 : 7 - day; // If today is Sunday, return 0, otherwise calculate days until Sunday
};

// Store the current date to avoid repeated new Date() calls
const currentDate = new Date();

// Calculate the offset once to avoid repeated calculations
const daysUntilNextSunday = getDaysUntilNextSunday(currentDate);

export const healthSampleEvents: CalendarEvent[] = [
    {
        id: "med-1",
        title: "Morning Blood Pressure Medicine",
        description: "Take 1 pill of Amlodipine after breakfast",
        start: setMinutes(setHours(addDays(currentDate, daysUntilNextSunday - 5), 8), 0),
        end: setMinutes(setHours(addDays(currentDate, daysUntilNextSunday - 5), 8), 15),
        color: "emerald",
        location: "Home",
    },
    {
        id: "ex-1",
        title: "Morning Jog",
        description: "30 minutes jogging in the park",
        start: setMinutes(setHours(addDays(currentDate, -4 + daysUntilNextSunday), 7), 0),
        end: setMinutes(setHours(addDays(currentDate, -4 + daysUntilNextSunday), 7), 30),
        color: "blue",
        location: "City Park",
    },
    {
        id: "diet-1",
        title: "Lunch Meal Plan",
        description: "Grilled chicken salad with whole wheat bread",
        start: setMinutes(setHours(addDays(currentDate, -6 + daysUntilNextSunday), 12), 30),
        end: setMinutes(setHours(addDays(currentDate, -6 + daysUntilNextSunday), 13), 0),
        color: "orange",
        location: "Home Kitchen",
    },
    {
        id: "med-2",
        title: "Evening Diabetes Medication",
        description: "Take 1 tablet of Metformin after dinner",
        start: setMinutes(setHours(addDays(currentDate, -6 + daysUntilNextSunday), 20), 0),
        end: setMinutes(setHours(addDays(currentDate, -6 + daysUntilNextSunday), 20), 15),
        color: "emerald",
        location: "Home",
    },
    {
        id: "ex-2",
        title: "Evening Yoga",
        description: "Relaxing yoga session for 45 minutes",
        start: setMinutes(setHours(addDays(currentDate, -5 + daysUntilNextSunday), 18), 0),
        end: setMinutes(setHours(addDays(currentDate, -5 + daysUntilNextSunday), 18), 45),
        color: "blue",
        location: "Yoga Center",
    },
    {
        id: "diet-2",
        title: "Breakfast Meal Plan",
        description: "Oatmeal with fruits and nuts",
        start: setMinutes(setHours(addDays(currentDate, -5 + daysUntilNextSunday), 8), 0),
        end: setMinutes(setHours(addDays(currentDate, -5 + daysUntilNextSunday), 8), 30),
        color: "orange",
        location: "Home Kitchen",
    },
    {
        id: "med-3",
        title: "Weekly Vitamin D Supplement",
        description: "Take 1 Vitamin D tablet (weekly)",
        start: setMinutes(setHours(addDays(currentDate, -4 + daysUntilNextSunday), 9), 0),
        end: setMinutes(setHours(addDays(currentDate, -4 + daysUntilNextSunday), 9), 15),
        color: "emerald",
        location: "Home",
    },
    {
        id: "ex-3",
        title: "Strength Training",
        description: "Weight lifting at the gym (1 hour)",
        start: setMinutes(setHours(addDays(currentDate, -4 + daysUntilNextSunday), 17), 0),
        end: setMinutes(setHours(addDays(currentDate, -4 + daysUntilNextSunday), 18), 0),
        color: "blue",
        location: "Local Gym",
    },
    {
        id: "diet-3",
        title: "Snack Time",
        description: "Protein shake and a handful of almonds",
        start: setMinutes(setHours(addDays(currentDate, -3 + daysUntilNextSunday), 15), 30),
        end: setMinutes(setHours(addDays(currentDate, -3 + daysUntilNextSunday), 16), 0),
        color: "orange",
        location: "Office",
    },
    {
        id: "med-4",
        title: "Post-Lunch Blood Pressure Medicine",
        description: "Take 1 pill of Amlodipine after lunch",
        start: setMinutes(setHours(addDays(currentDate, -3 + daysUntilNextSunday), 13), 0),
        end: setMinutes(setHours(addDays(currentDate, -3 + daysUntilNextSunday), 13), 15),
        color: "emerald",
        location: "Home",
    },
    {
        id: "ex-4",
        title: "Evening Walk",
        description: "20-minute walk to improve digestion",
        start: setMinutes(setHours(addDays(currentDate, -2 + daysUntilNextSunday), 19), 0),
        end: setMinutes(setHours(addDays(currentDate, -2 + daysUntilNextSunday), 19), 20),
        color: "blue",
        location: "Neighborhood Path",
    },
    {
        id: "diet-4",
        title: "Dinner Meal Plan",
        description: "Grilled salmon, steamed vegetables, and quinoa",
        start: setMinutes(setHours(addDays(currentDate, -2 + daysUntilNextSunday), 20), 0),
        end: setMinutes(setHours(addDays(currentDate, -2 + daysUntilNextSunday), 20), 30),
        color: "orange",
        location: "Home Kitchen",
    },

    {
        id: "sleep-1",
        title: "Night Sleep",
        description: "Sleep from 10:30 PM to 6:30 AM",
        start: setMinutes(setHours(addDays(currentDate, -1 + daysUntilNextSunday), 22), 30),
        end: setMinutes(setHours(addDays(currentDate, daysUntilNextSunday), 6), 30),
        color: "violet",
        location: "Home Bedroom",
    },
    {
        id: "sleep-2",
        title: "Afternoon Nap",
        description: "Short 30-minute power nap",
        start: setMinutes(setHours(addDays(currentDate, -1 + daysUntilNextSunday), 14), 0),
        end: setMinutes(setHours(addDays(currentDate, -1 + daysUntilNextSunday), 14), 30),
        color: "violet",
        location: "Home Bedroom",
    },

];
