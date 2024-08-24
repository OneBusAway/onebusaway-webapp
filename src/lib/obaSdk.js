import onebusaway from 'onebusaway-sdk';
import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';
import { json } from '@sveltejs/kit';

const oba = new onebusaway({
	baseURL,
	apiKey
});

export function handleOBAResponse(response, entityName) {
	if (response.code !== 200) {
		return error(500, `Unable to fetch ${entityName}.`);
	}

	return json(response);
}

export default oba;
