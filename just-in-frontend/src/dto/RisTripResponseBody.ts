import type { RisJourneyType } from "./RisJourneyType";
import type { RisRoutingLegStopPlace } from "./RisRoutingResponseBody";
import type { TravellerPersona } from "./TravellerPersona";
import type { TripStatus } from "./TripStatus";

export interface RisTripResponseBody {
    tripID: string;
    persona: TravellerPersona;
    status: TripStatus;
    plannedTripStart: string;
    plannedTripEnd: string;
    legs: RisTripLeg[];
};

export interface RisTripLeg {
    type: RisJourneyType;
    journeyID?: string;
    departure?: RisTripDepartureArrival;
    arrival?: RisTripDepartureArrival;
    evaluation?: RisTripEvaluation;
};

export interface RisTripDepartureArrival {
    stopPlace: RisRoutingLegStopPlace;
    timeSchedule: string;
    time: string;
    timeType: RisTripTimeType;
    platformSchedule: string;
    platform: string;
    messages: string[];
    disruptions: string[];
    arrivalID?: string;
    departureID?: string;
    canceled: boolean;
};

export interface RisTripEvaluation {
    status: TripStatus;
    duration: string;
};

export enum RisTripTimeType {
    REAL = "REAL",
    PREVIEW = "PREVIEW",
    SCHEDULE = "SCHEDULE",
};
