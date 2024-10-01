import type { RisTripRequestLeg } from "../dto/RisTripRequest";
import type { TravellerPersona } from "../dto/TravellerPersona";

export async function createTrip(
    persona: TravellerPersona,
    legs: RisTripRequestLeg[]
): Promise<string> {
    return "It works!";
}
