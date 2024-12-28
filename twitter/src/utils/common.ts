export const numberEnumToArray = (value: { [key: string]: number | string }) => {
  return Object.values(value).filter((key) => typeof key === 'number')
}
