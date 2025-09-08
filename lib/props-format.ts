export const formatLabel = (value: string) => {
  const result = value.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatValue = (value: string | number | boolean | Date | Array<any> | object | null) => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (value instanceof Array) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return '';
  }

  return value;
};
