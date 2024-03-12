function camelCaseToPretty(input: string): string {
  const snakeCase = input.replace(
    /[A-Z]/g,
    (match) => `_${match.toLowerCase()}`
  );

  const upperCase = snakeCase.toUpperCase();

  const result = upperCase.replace(/_/g, " ");

  return result.replace(/\s+/g, " ").trim();
}

export { camelCaseToPretty };
