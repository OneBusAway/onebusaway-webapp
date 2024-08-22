import onebusaway from 'onebusaway-sdk';
import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

const oba = new onebusaway({
	baseURL,
	apiKey
});

export default oba;
