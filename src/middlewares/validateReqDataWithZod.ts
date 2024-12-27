import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { baseSchema, mainSchema } from '@/schemas/main';
import { AppError } from '@/common/utils';
import { catchAsync } from '@/middlewares/catchAsyncErrors';

type MyDataShape = z.infer<typeof baseSchema>;

export const validateData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const rawData = req.body as Partial<MyDataShape>;
	if (!rawData) return next();

	// Validate each field in req.body individually
	for (const key in rawData) {
		if (baseSchema.shape[key]) {
			const result = baseSchema.shape[key].safeParse(rawData[key]);
			if (!result.success) {
				const errMessage = result.error.errors[0].message.replace(/^[A-Z]/, (match) => match.toLowerCase());
				throw new AppError(errMessage, 422);
			}
		}
	}

	// Create a new schema from mainSchema that only includes the fields present in req.body
	const mainKeysObj = Object.fromEntries(Object.keys(rawData).map((key) => [key, true]));
	const mainSchemaObject = mainSchema.shape;
	const newMainSchemaShape = Object.keys(mainSchemaObject)
		.filter((key) => mainKeysObj[key])
		.reduce(
			(obj, key) => {
				obj[key] = mainSchemaObject[key];
				return obj;
			},
			{} as Record<string, z.ZodTypeAny>
		);

	const newMainSchema = z.object(newMainSchemaShape);
	// Validate req.body against the new mainSchema
	const mainResult = newMainSchema.safeParse(rawData);
	if (!mainResult.success) {
		for (const error of mainResult.error.errors) {
			const genErrMessage = `${error.message.replace(/^[A-Z]/, (match) => match.toLowerCase())}`;
			console.log(genErrMessage);
			throw new AppError(genErrMessage, 422);
		}

		throw new AppError('Input Validation error', 422);
	}

	req.body = mainResult.data as MyDataShape;
	next();
});
