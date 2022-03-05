export function defaultValue(t: Function): any {
  if (t === Number) return 0;
  if (t === String) return '';
  if (t === Boolean) return false;
  if (t === Date) return new Date();
  return null;
}

export type ViewTemplate = (...args: any[]) => JSX.Element;
