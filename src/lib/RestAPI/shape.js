import oba from '../obaSdk';
import { error, json } from '@sveltejs/kit';
export default async function shape(shapeId) {
	const response = await oba.shape.retrieve(shapeId);

	if (response.code !== 200) {
		return error(500, 'Unable to fetch shape.');
	}

	return json(response);
}
