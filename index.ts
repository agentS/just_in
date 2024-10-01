import { queryRouting } from "./ris/RisRoutingAccessor";
import { createTrip } from "./ris/RisTripAccessor";

const risRoutingResponse = await queryRouting("8011160", "8102067");
// const tripId = await createTrip();
console.log(risRoutingResponse);
console.log("Just check Just-In");
