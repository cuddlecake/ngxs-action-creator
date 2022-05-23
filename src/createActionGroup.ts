import { createAction } from './createAction';
import {
  ActionCreator,
  EmptyActionCreator,
  EmptyProps,
  Props,
  SourceActionName,
  TypeFromProps,
} from './models';

export type ActionGroupInput<Actions extends Record<string, Props | EmptyProps>> ={
  [EventName in keyof Actions]: Actions[EventName] &
  EmptyStringCheck<EventName & string, 'event name'> &
  TemplateLiteralCheck<EventName & string, 'event name'> &
  ForbiddenCharactersCheck<EventName & string, 'event name'> &
  UniqueEventNameCheck<keyof Actions & string, EventName & string>;
}

export function createActionGroup<
  Source extends string,
  Actions extends Record<string, Props | EmptyProps>
>(
  source: Source,
  actions: ActionGroupInput<Actions>
): ActionCreatorGroup<Actions, Source> {
  const result = Object.fromEntries(
    Object.entries(actions).map(([name, propsType]) => {
      return [
        toActionName(name),
        propsType._as === 'empty'
          ? createAction(`[${source}] ${name}`)
          : createAction(`[${source}] ${name}`, propsType),
      ];
    })
  );

  return result as ActionCreatorGroup<Actions, Source>;
}

export function toSourcedActionName<Source extends string, EventName extends string>(source: Source, eventName: EventName): `[${Source}] ${ActionName<EventName>}`{
  return `[${source}] ${toActionName(eventName)}`

}

export function toActionName<EventName extends string>(
  eventName: EventName
): ActionName<EventName> {
  return eventName
    .trim()
    .toLowerCase()
    .split(' ')
    .map(capitalize)
    .join('') as ActionName<EventName>;
}

function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>;
}

type Join<
  Str extends string,
  Separator extends string = ' '
> = Str extends `${infer First}${Separator}${infer Rest}`
  ? Join<`${First}${Rest}`, Separator>
  : Str;
type Trim<Str extends string> = Str extends ` ${infer S}`
  ? Trim<S>
  : Str extends `${infer S} `
  ? Trim<S>
  : Str;
type TitleCase<Str extends string> = Str extends `${infer First} ${infer Rest}`
  ? `${Capitalize<First>} ${TitleCase<Rest>}`
  : Capitalize<Str>;
type ForbiddenCharacters =
  | '/'
  | '\\'
  | '|'
  | '<'
  | '>'
  | '['
  | ']'
  | '{'
  | '}'
  | '('
  | ')'
  | '.'
  | ','
  | '!'
  | '?'
  | '#'
  | '%'
  | '^'
  | '&'
  | '*'
  | '+'
  | '-'
  | '~'
  | "'"
  | '"'
  | '`';
export type ForbiddenCharactersCheck<
  Str extends string,
  Name extends string
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = Str extends `${infer _}${ForbiddenCharacters}${infer _}`
  ? `${Name} cannot contain ${ForbiddenCharacters}`
  : unknown;
export type EmptyStringCheck<
  Str extends string,
  Name extends string
> = Trim<Str> extends ''
  ? `${Name} cannot be an empty string or contain only spaces`
  : unknown;
export type TemplateLiteralCheck<
  Str extends string,
  Name extends string
> = string extends Str ? `${Name} must be a template literal type` : unknown;
export type UniqueEventNameCheck<
  EventNames extends string,
  EventName extends string
> = ActionName<EventName> extends ActionName<Exclude<EventNames, EventName>>
  ? `${ActionName<EventName>} action is already defined`
  : unknown;

export type ActionName<EventName extends string> = Join<
  TitleCase<Lowercase<Trim<EventName>>>
>;

export type ActionCreatorGroup<
  Actions extends Record<string, Props | EmptyProps>,
  Source extends string
> = {
  [key in keyof Actions as ActionName<
    key & string
  >]: Actions[key] extends EmptyProps
    ? EmptyActionCreator<SourceActionName<Source, Actions[key] & string>>
    : ActionCreator<
        SourceActionName<Source, key & string>,
        TypeFromProps<Actions[key]>
      >;
};
