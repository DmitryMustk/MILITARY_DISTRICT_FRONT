import action from '../messages/en/action.json';
import component from '../messages/en/component.json';
import enums from '../messages/en/enum.json';
import page from '../messages/en/page.json';
import zod from '../messages/en/zod.json';

type Messages = {
  Action: typeof action;
  Component: typeof component;
  Enum: typeof enums;
  Page: typeof page;
  Zod: typeof zod;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
