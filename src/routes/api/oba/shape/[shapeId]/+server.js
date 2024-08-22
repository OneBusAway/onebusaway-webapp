import { error, json } from '@sveltejs/kit';
import oba from '../../../../../lib/obaSdk.js';
import shape from '../../../../../lib/RestAPI/shape.js';

export async function GET({ params }) {
	const shapeId = params.shapeId;
	return shape(shapeId);
}
