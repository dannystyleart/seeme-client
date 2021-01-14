export const isNonEmptyString = (arg: any): arg is string => typeof arg === 'string' && arg.length > 0;

export const isHttpProtocol = (arg: any): boolean => isNonEmptyString(arg) && /^https?:/i.test(arg);

export const isValidIPv4Address = (arg: any): boolean => {
  if (!isNonEmptyString(arg)) return false;
  const pattern = /^(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return pattern.test(arg);
};

export const withDefaults = (object: any, defaults: any) => ({
  ...defaults,
  ...object
});

export const removeSlash = (subject: string, trailing = true): string => {
  const pattern = trailing ? /\/$/ : /^\//;
  return subject.replace(pattern, '');
};
