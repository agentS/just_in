import type { TravellerPersona } from "./TravellerPersona";

export interface RisRoutingRequestBody {
    provider: "HAFAS";
    connectionEvaluationPersona: TravellerPersona[];
    departureTime: string;
    origin: RisRoutingStop;
    destination: RisRoutingStop;
};

export interface RisRoutingStop {
    type: "STOP_PLACE";
    evaNumber: string;
};
