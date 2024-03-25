function camelCaseToPretty(input: string): string {
  const result = input.replace(/([a-z])([A-Z])/g, "$1 $2");
  return result.toUpperCase();
}

export { camelCaseToPretty };
