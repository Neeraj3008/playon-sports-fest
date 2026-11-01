import Event from "./models/Event.js";

// Events are inserted automatically the first time the server connects to an empty database
export const EVENTS = [
  {
    sport: "pickleball",
    title: "Pickleball Doubles",
    description: "Fast-paced doubles on hard courts. Best of 3 games to 11.",
    date: new Date("2027-01-16T08:00:00+05:30"),
    venue: "Indoor Courts, Juhu",
    entryFee: 400,
    teamSize: 2,
    maxTeams: 16,
    icon: "🏓",
  },
  {
    sport: "badminton",
    title: "Badminton Doubles",
    description: "Knockout doubles, 21-point rally scoring.",
    date: new Date("2027-01-16T14:00:00+05:30"),
    venue: "College Gymkhana",
    entryFee: 300,
    teamSize: 2,
    maxTeams: 24,
    icon: "🏸",
  },
  {
    sport: "box-cricket",
    title: "Box Cricket",
    description: "6-a-side, 6 overs per innings, tennis ball.",
    date: new Date("2027-01-17T09:00:00+05:30"),
    venue: "Turf Arena, Vile Parle",
    entryFee: 1200,
    teamSize: 6,
    maxTeams: 12,
    icon: "🏏",
  },
  {
    sport: "tennis",
    title: "Lawn Tennis Singles",
    description: "Pro-set to 8 games, tie-break at 7-7.",
    date: new Date("2027-01-17T07:30:00+05:30"),
    venue: "Khar Gymkhana",
    entryFee: 350,
    teamSize: 1,
    maxTeams: 32,
    icon: "🎾",
  },
  {
    sport: "football",
    title: "5-a-side Football",
    description: "Two halves of 10 minutes on a rooftop turf.",
    date: new Date("2027-01-18T16:00:00+05:30"),
    venue: "Turf Arena, Vile Parle",
    entryFee: 1000,
    teamSize: 5,
    maxTeams: 12,
    icon: "⚽",
  },
];

export async function seedEvents() {
  if ((await Event.countDocuments()) === 0) {
    await Event.insertMany(EVENTS);
    console.log("Seeded", EVENTS.length, "events");
  }
}
