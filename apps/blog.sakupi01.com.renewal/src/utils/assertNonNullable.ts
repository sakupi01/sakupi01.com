type AssertIsNonNullable<Type> = (
  value: Type,
) => asserts value is NonNullable<Type>;

const ERROR_MESSAGE_NULLABLE =
  "Expected value should be neither null nor undefined.";

export const assertNonNullable: AssertIsNonNullable<unknown> = (value) => {
  if (value === null || value === undefined) {
    throw new Error(ERROR_MESSAGE_NULLABLE);
  }
};

type AssertArrayIsNonNullable<Type> = (
  array: Type[],
) => asserts array is NonNullable<Type>[];

export const assertArrayNonNullable: AssertArrayIsNonNullable<unknown> = (
  array,
) => {
  if (array.some((value) => value === null || value === undefined)) {
    throw new Error(ERROR_MESSAGE_NULLABLE);
  }
};
