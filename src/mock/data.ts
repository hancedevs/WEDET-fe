import { BookingItem } from "@/types/type";

export const mockBookings: BookingItem[] = [
    { id: 1, name: "Suba", amount: -2900, date: "20/20/2020" },
    { id: 2, name: "Kuriftu Resort", amount: -5000, date: "21/12/2021" },
    { id: 3, name: "Lake Tana", amount: -3500, date: "15/10/2022" },
];

export const initialTourData: any = {
    id: 1,
    overview:
        "This is a comprehensive 7-day tour through the remote mountains of Patagonia. Experience breathtaking views, challenging treks, and unique wildlife encounters. Suitable for experienced hikers. The focus is on stunning glacial landscapes and the iconic peaks of Fitz Roy and Cerro Torre.",
    highlights:
        "Hike the world-famous Fitz Roy trail.\nWitness the spectacular Perito Moreno Glacier calving.\nCamp under the stars in remote, untouched Patagonian wilderness.\nSpot native wildlife like condors, guanacos, and pumas.",
    includes: [
        "All ground transport (Airport/Hotel/Trailhead)",
        "6 Nights Accommodation (3 nights camping, 3 nights refugios)",
        "All meals (B, L, D) starting with dinner on Day 1",
        "Expert WFR-certified local guide",
    ],
    notIncludes: [
        "International flights",
        "Travel insurance (mandatory)",
        "Alcoholic beverages",
        "Tips for guide and staff",
    ],
    essentialEquipment: [
        "Waterproof, broken-in hiking boots",
        "4-Season Sleeping Bag rated to 0°F (-18°C)",
        "Headlamp with extra batteries",
        "Sunscreen and UV-protected sunglasses",
        "Layers of moisture-wicking clothing (no cotton!)",
    ],
    activities: JSON.stringify({
        day1: {
            meals: { breakfast: false, lunch: true, dinner: true },
            activities: [
                {
                    time: "2:00 PM",
                    activity: "Arrive in El Chaltén and check into Refugio",
                },
                {
                    time: "5:00 PM",
                    activity: "Gear check and welcome briefing with guide",
                },
                { time: "7:00 PM", activity: "Dinner and tour orientation" },
            ],
        },
        day2: {
            meals: { breakfast: true, lunch: true, dinner: true },
            activities: [
                {
                    time: "8:00 AM",
                    activity: "Breakfast and drive to trailhead",
                },
                {
                    time: "9:30 AM",
                    activity: "Begin trek to Poincenot Campsite (7 hours)",
                },
                {
                    time: "5:00 PM",
                    activity: "Set up camp below Fitz Roy, dinner",
                },
            ],
        },
        day3: {
            meals: { breakfast: true, lunch: true, dinner: true },
            activities: [
                {
                    time: "6:00 AM",
                    activity:
                        "Pre-dawn hike to Laguna de los Tres for sunrise views of Fitz Roy",
                },
                {
                    time: "10:00 AM",
                    activity:
                        "Return to camp and continue trek towards Cerro Torre",
                },
                {
                    time: "5:00 PM",
                    activity: "Camp at Agostini Campsite, dinner",
                },
            ],
        },
    }),
};
