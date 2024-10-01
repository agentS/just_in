import type { RisJourneyType } from "./RisJourneyType";

export interface RisRoutingResponseBody {
    trips: RisRoutingTrip[];
};

export interface RisRoutingTrip {
    startDate: string;
    duration: string;
    legs: RisRoutingLeg[];
};

export interface RisRoutingLeg {
    type: RisJourneyType;
    departure: RisRoutingLegDepartureArrival;
    arrival: RisRoutingLegDepartureArrival;
};

export interface RisRoutingLegDepartureArrival {
    stopPlace: RisRoutingLegStopPlace;
    timeSchedule: string;
    timeType: "SCHEDULE";
    platformSchedule: string;
    platform: string;
    transport: RisRoutingLegType;
};

export interface RisRoutingLegStopPlace {
    evaNumber: string;
    name: string;
}

export interface RisRoutingLegType {
    type: string;
    category: string;
    number: number;
};
