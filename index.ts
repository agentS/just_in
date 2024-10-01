import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { RisJourneyType } from "./dto/RisJourneyType";
import type { RisTripRequestLeg } from "./dto/RisTripRequest";
import { TravellerPersona } from "./dto/TravellerPersona";
import { queryRouting } from "./ris/RisRoutingAccessor";
import { createTrip } from "./ris/RisTripAccessor";

const SERVER_PORT = 8080;

// we found a bug in the RIS::Trips API --> please ask Thies Clasen for more information 
const webApplication = new Elysia()
    .use(swagger())
    // curl -X POST -i http://127.0.0.1:8080/registerJourney/8011160/8102067/2024-10-01T06:26:00Z
    .post("/registerJourney/:departureId/:arrivalId/:departureDate", async ({ params: { departureId, arrivalId, departureDate } }) => {
        const risRoutingResponse = await queryRouting(departureId, arrivalId, departureDate);

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
    }).listen(SERVER_PORT);
console.log("web application listening at port " + SERVER_PORT);
