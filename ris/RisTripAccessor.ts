import * as util from "util";

import type { RisTripRequestCreateBody, RisTripRequestLeg } from "../dto/RisTripRequest";
import type { TravellerPersona } from "../dto/TravellerPersona";
import { HTTP_STATUS_CODE_SUCCESS } from "./RisConstants";

export async function createTrip(
    persona: TravellerPersona,
    legs: RisTripRequestLeg[]
): Promise<string> {
    const requestBody: RisTripRequestCreateBody = {
        persona,
        legs
    };
    const risRoutingResponse = await fetch(
        "https://apis.deutschebahn.com/db/apis/ris-trips/v1/trips/unmatched",
        {
            headers: {
                "Content-Type": "application/json",
                "DB-Client-ID": process.env.DB_CLIENT_ID as string,
                "DB-Api-Key": process.env.DB_API_KEY as string,
            },
            body: JSON.stringify(requestBody),
            method: "POST",
        },
    );
    if (risRoutingResponse.status !== HTTP_STATUS_CODE_SUCCESS) {
        throw new Error(await risRoutingResponse.text());
    }
    const responseBody = await risRoutingResponse.json();
    console.log(util.inspect(responseBody, {showHidden: false, depth: null, colors: true}));
    return responseBody.tripID;
}
