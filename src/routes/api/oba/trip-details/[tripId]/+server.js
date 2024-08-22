import tripDetails from '../../../../../lib/RestAPI/tripDetails.js';

export async function GET({ params, url }) {
	const { tripId } = params;

	const serviceDate = url.searchParams.get('serviceDate');
	const includeTrip = url.searchParams.get('includeTrip') || 'true';
	const includeSchedule = url.searchParams.get('includeSchedule') || 'true';
	const includeStatus = url.searchParams.get('includeStatus') || 'true';
	const time = url.searchParams.get('time');

	const queryParams = {
		includeTrip,
		includeSchedule,
		includeStatus
	};

	if (time) {
		queryParams.time = time;
	}

	if (serviceDate) {
		queryParams.serviceDate = serviceDate;
	}

	return tripDetails(tripId, queryParams);
}
