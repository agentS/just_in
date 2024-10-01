import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { RisJourneyType } from "./dto/RisJourneyType";
import type { RisTripRequestLeg } from "./dto/RisTripRequest";
import { TravellerPersona } from "./dto/TravellerPersona";
import { queryRouting } from "./ris/RisRoutingAccessor";
import { createTrip, fetchJourney } from "./ris/RisTripAccessor";
import { RisTripTimeType, type RisTripResponseBody } from "./dto/RisTripResponseBody";
import { TripStatus } from "./dto/TripStatus";

const SERVER_PORT = 8080;

// we found a bug in the RIS::Trips API --> please ask Thies Clasen for more information 
new Elysia()
    .use(cors())
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
        console.log(tripLegs); // for debugging purposes
        const tripId = await createTrip(
            TravellerPersona.OCCASIONAL_TRAVELLER,
            tripLegs
        );
        return {
            "tripID": tripId,
        };
    })
    // curl -X GET -H "Accept: application/json" -i http://127.0.0.1:8080/loadJourney/a51a5826-36d0-4085-8694-3ab252943d68
    .get("/loadJourney/:tripId", async ({ params: { tripId } }) => {
        // return await fetchJourney(tripId);
        // as there's a bug in the RIS::Trips API, we need to mock the data --> ask Thies Clasen for all the details
        const responseBody: RisTripResponseBody = {
            "tripID": tripId,
            "persona": TravellerPersona.OCCASIONAL_TRAVELLER,
            "status": TripStatus.IMPOSSIBLE,
            "plannedTripStart": "2024-10-01T07:04:00Z",
            "plannedTripEnd": "2024-10-01T14:03:00Z",
            "legs": [
                {
                    "type": RisJourneyType.JOURNEY,
                    "journeyID": "20241001-dba4506b-6ffb-3467-9360-6777e1108a9a",
                    "departure": {
                        "stopPlace": {
                            "evaNumber": "8098160",
                            "name": "Berlin Hbf"
                        },
                        "timeSchedule": "2024-10-01T07:04:00Z",
                        "timeType": RisTripTimeType.REAL,
                        "time": "2024-10-01T07:04:57Z",
                        "platformSchedule": "3",
                        "platform": "4",
                        "messages": ["Gleiswechsel"],
                        "disruptions": [],
                        "departureID": "8098160_D_1",
                        "canceled": false
                    },
                    "arrival": {
                        "stopPlace": {
                            "evaNumber": "8000261",
                            "name": "München Hbf"
                        },
                        "timeSchedule": "2024-10-01T11:09:00Z",
                        "timeType": RisTripTimeType.PREVIEW,
                        "time": "2024-10-01T11:27:00Z",
                        "platformSchedule": "20",
                        "platform": "20",
                        "messages": [],
                        "disruptions": ["Personen auf der Strecke"],
                        "arrivalID": "8000261_A_1",
                        "canceled": false
                    }
                },
                {
                    "type": RisJourneyType.CONNECT,
                    "evaluation": {
                        "status": TripStatus.IMPOSSIBLE,
                        "duration": "PT8M"
                    }
                },
                {
                    "type": RisJourneyType.JOURNEY,
                    "journeyID": "20241001-3b5757f5-9e69-3c1e-b102-61031e29be48",
                    "departure": {
                        "stopPlace": {
                            "evaNumber": "8000261",
                            "name": "München Hbf"
                        },
                        "timeSchedule": "2024-10-01T11:29:00Z",
                        "timeType": RisTripTimeType.REAL,
                        "time": "2024-10-01T11:29:23Z",
                        "platformSchedule": "15",
                        "platform": "15",
                        "messages": [],
                        "disruptions": [],
                        "departureID": "8000261_D_1",
                        "canceled": false
                    },
                    "arrival": {
                        "stopPlace": {
                            "evaNumber": "8100002",
                            "name": "Salzburg Hbf"
                        },
                        "timeSchedule": "2024-10-01T12:58:00Z",
                        "timeType": RisTripTimeType.PREVIEW,
                        "time": "2024-10-01T13:00:00Z",
                        "platformSchedule": "",
                        "platform": "",
                        "messages": [],
                        "disruptions": [],
                        "arrivalID": "8100002_A_1",
                        "canceled": false
                    }
                },
                {
                    "type": RisJourneyType.CONNECT,
                    "evaluation": {
                        "status": TripStatus.SAFE,
                        "duration": "PT7M"
                    }
                },
                {
                    "type": RisJourneyType.JOURNEY,
                    "journeyID": "20241001-d74ec4a4-4664-3c53-aeab-3f774f43b10a",
                    "departure": {
                        "stopPlace": {
                            "evaNumber": "8100414",
                            "name": "Salzburg Hbf (Bahnsteige 11-12)"
                        },
                        "timeSchedule": "2024-10-01T13:15:00Z",
                        "timeType": RisTripTimeType.SCHEDULE,
                        "time": "2024-10-01T13:15:00Z",
                        "platformSchedule": "",
                        "platform": "",
                        "messages": [],
                        "disruptions": [],
                        "departureID": "8100414_D_1",
                        "canceled": false
                    },
                    "arrival": {
                        "stopPlace": {
                            "evaNumber": "8102067",
                            "name": "Ostermiething"
                        },
                        "timeSchedule": "2024-10-01T14:03:00Z",
                        "timeType": RisTripTimeType.SCHEDULE,
                        "time": "2024-10-01T14:03:00Z",
                        "platformSchedule": "",
                        "platform": "",
                        "messages": [],
                        "disruptions": [],
                        "arrivalID": "8102067_A_1",
                        "canceled": false
                    }
                }
            ]
        };
        return responseBody;
    })
    .listen(SERVER_PORT);
console.log("web application listening at port " + SERVER_PORT);
