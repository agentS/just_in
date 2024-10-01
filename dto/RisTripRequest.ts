import type { TravellerPersona } from "./TravellerPersona";

export interface RisTripRequestCreateBody {
    persona: TravellerPersona;
    legs: RisTripRequestLeg[];
};

export interface RisTripRequestLeg {
    type: "JOURNEY";
    departure: RisTripRequestLegDepartureArrival;
    arrival: RisTripRequestLegDepartureArrival;
};

export interface RisTripRequestLegDepartureArrival {
    evaNumber: string;
    date: string;
    timeSchedule: string;
    category: string;
    journeyNumber: number;
};
