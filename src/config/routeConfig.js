import {
	faBus,
	faFerry,
	faTrainSubway,
	faTrain,
	faCableCar
} from '@fortawesome/free-solid-svg-icons';

const RouteType = {
	LIGHT_RAIL: 0,
	SUBWAY: 1,
	RAIL: 2,
	BUS: 3,
	FERRY: 4,
	CABLE_CAR: 5,
	GONDOLA: 6,
	FUNICULAR: 7,
	UNKNOWN: 999
};

const routePriorities = [
	RouteType.FERRY,
	RouteType.LIGHT_RAIL,
	RouteType.SUBWAY,
	RouteType.RAIL,
	RouteType.BUS,
	RouteType.CABLE_CAR,
	RouteType.GONDOLA,
	RouteType.FUNICULAR,
	RouteType.UNKNOWN
];

const prioritizedRouteTypeForDisplay = (routeType) => {
	switch (routeType) {
		case RouteType.FERRY:
			return faFerry;
		case RouteType.LIGHT_RAIL:
		case RouteType.SUBWAY:
		case RouteType.CABLE_CAR:
			return faTrainSubway;
		case RouteType.RAIL:
			return faTrain;
		case RouteType.GONDOLA:
			return faCableCar;
		default:
			return faBus;
	}
};

export { RouteType, routePriorities, prioritizedRouteTypeForDisplay };
