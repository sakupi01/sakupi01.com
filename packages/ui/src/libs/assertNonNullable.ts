type AssertIsNonNullable<Type> = (
  value: Type
) => asserts value is NonNullable<Type>;

const ERROR_MESSAGE_NULLABLE =
  "Expected value should be neither null nor undefined.";

export const assertNonNullable: AssertIsNonNullable<unknown> = (value) => {
  if (value === null || value === undefined) {
    throw new Error(ERROR_MESSAGE_NULLABLE);
  }
};
