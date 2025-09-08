import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = 'en';

  const action = await import(`../messages/${locale}/action.json`);
  const component = await import(`../messages/${locale}/component.json`);
  const enums = await import(`../messages/${locale}/enum.json`);
  const page = await import(`../messages/${locale}/page.json`);
  const zod = await import(`../messages/${locale}/zod.json`);

  return {
    locale,
    messages: {
      Action: action.default,
      Component: component.default,
      Enum: enums.default,
      Page: page.default,
      Zod: zod.default,
    },
  };
});
