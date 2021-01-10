export const isNonEmptyString = (arg: any): arg is string => typeof arg === 'string' && arg.length > 0;
export const isHttpProtocol = (arg: any): boolean => isNonEmptyString(arg) && /^https?:/i.test(arg);
export const withDefaults = (object: any, defaults: any) => ({
  ...defaults,
  ...object
});
