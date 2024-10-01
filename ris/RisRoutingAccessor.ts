import { HTTP_STATUS_CODE_SUCCESS } from "./RisConstants";
import type { RisRoutingRequestBody } from "../dto/RisRoutingRequestBody";
import type { RisRoutingResponseBody } from "../dto/RisRoutingResponseBody";
import { TravellerPersona } from "../dto/TravellerPersona";

export async function queryRouting(departureEva: string, arrivalEva: string, departureDateTime: string): Promise<RisRoutingResponseBody> {
    const risRoutingRequestBody: RisRoutingRequestBody = {
        provider: "HAFAS",
        connectionEvaluationPersona: [ TravellerPersona.OCCASIONAL_TRAVELLER ],
        departureTime: departureDateTime,
        origin: {
            evaNumber: departureEva,
            type: "STOP_PLACE",
        },
        destination: {
            evaNumber: arrivalEva,
            type: "STOP_PLACE",
        },
    };
    const risRoutingResponse = await fetch(
        "https://apis.deutschebahn.com/db/apis/ris-routing/v2/multimodal",
        {
            headers: {
                "Content-Type": "application/json",
                "DB-Client-ID": process.env.DB_CLIENT_ID as string,
                "DB-Api-Key": process.env.DB_API_KEY as string,
            },
            body: JSON.stringify(risRoutingRequestBody),
            method: "POST",
        },
    );
    if (risRoutingResponse.status !== HTTP_STATUS_CODE_SUCCESS) {
        throw new Error(await risRoutingResponse.text());
    }
    return (await risRoutingResponse.json());
}