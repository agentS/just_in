import { Elysia } from "elysia";
import { RisJourneyType } from "./dto/RisJourneyType";
import type { RisTripRequestLeg } from "./dto/RisTripRequest";
import { TravellerPersona } from "./dto/TravellerPersona";
import { queryRouting } from "./ris/RisRoutingAccessor";
import { createTrip } from "./ris/RisTripAccessor";

// const risRoutingResponse = await queryRouting("8011160", "8102067", "2024-10-01T06:26:00Z");
const risRoutingResponse = await queryRouting("8011160", "8001825", "2024-10-01T06:26:00Z");

const SERVER_PORT = 8080;

const webApplication = new Elysia();
webApplication.post("/registerJourney", async () => {
    const trip = risRoutingResponse.trips[0];
    const legs = trip.legs.filter((leg) => leg.type === RisJourneyType.JOURNEY);
    const tripLegs = legs.map((leg) => {
        const tripLeg: RisTripRequestLeg = {
            type: leg.type as "JOURNEY",
            departure: {
                evaNumber: leg.departure.stopPlace.evaNumber,
                date: leg.departure.timeSchedule.substring(0, 10),
                timeSchedule: leg.departure.timeSchedule,
                category: leg.departure.transport.category,
                journeyNumber: leg.departure.transport.number,
            },
            arrival: {
                evaNumber: leg.arrival.stopPlace.evaNumber,
                date: leg.arrival.timeSchedule.substring(0, 10),
                timeSchedule: leg.arrival.timeSchedule,
                category: leg.arrival.transport.category,
                journeyNumber: leg.arrival.transport.number,
            },
        };
        return tripLeg;
    });
    console.log(tripLegs);
    const tripId = await createTrip(
        TravellerPersona.OCCASIONAL_TRAVELLER,
        tripLegs
    );
    return {
        "tripID": tripId,
    };
});
webApplication.listen(SERVER_PORT);
console.log("web application listening at port " + SERVER_PORT);
