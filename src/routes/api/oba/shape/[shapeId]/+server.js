import shape from '../../../../../lib/RestAPI/shape.js';

export async function GET({ params }) {
	const shapeId = params.shapeId;
	return shape(shapeId);
}
