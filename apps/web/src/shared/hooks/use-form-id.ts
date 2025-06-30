import { useId } from "react";

export const useFormId = <T extends string>(fields: T[]): Record<T, string> => {
	const baseId = useId();

	return fields.reduce(
		(acc, field) => {
			acc[field] = `${baseId}-${field}`;
			return acc;
		},
		{} as Record<T, string>,
	);
};
