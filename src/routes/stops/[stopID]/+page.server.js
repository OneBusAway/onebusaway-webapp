import stopAPI from '$lib/RestAPI/stop.js';
import arrivalDepartureAPI from '$lib/RestAPI/arrivalsAndDeparturesForStop.js';

export async function load({ params }) {
  const stopID = params.stopID;
  const stopResponse = await stopAPI(stopID);
  const stopBody = await stopResponse.json();
  const arrivalsAndDeparturesResponse = await arrivalDepartureAPI(stopID)
  const arrivalsAndDeparturesResponseJSON = await arrivalsAndDeparturesResponse.json();

  return {
    stopID: params.stopID,
    stopData: stopBody.data,
    arrivalsAndDeparturesResponse: arrivalsAndDeparturesResponseJSON
  }
}
