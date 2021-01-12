export const isNonEmptyString = (arg: any): arg is string => typeof arg === 'string' && arg.length > 0;

export const isHttpProtocol = (arg: any): boolean => isNonEmptyString(arg) && /^https?:/i.test(arg);

export const withDefaults = (object: any, defaults: any) => ({
  ...defaults,
  ...object
});

export const removeSlash = (subject: string, trailing = true): string => {
  const pattern = trailing ? /\/$/ : /^\//;
  return subject.replace(pattern, '');
};
