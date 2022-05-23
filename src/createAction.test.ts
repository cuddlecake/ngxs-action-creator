import { createAction, withoutProps, withProps } from './createAction';

it('should return a class with static property `type`', () => {
  const Action = createAction('My Type');

  expect(Action.type).toBe('My Type');
});

it('should create a class constructor with props when propsType is withProps', () => {
  const Action = createAction(
    'My Type',
    withProps<{ ok: boolean; message: string }>()
  );
  const actionInstance = new Action({ ok: true, message: 'hello' });
  expect(actionInstance.ok).toBe(true);
  expect(actionInstance.message).toBe('hello');
});

it('should not allow extraneous properties in type', () => {
  const Action = createAction('My Type', withProps<{ ok: true }>());

  // @ts-expect-error notOk should be unknown property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const actionInstance = new Action({ ok: true, notOk: true });
});

it('should create a class constructor without props when propsType is unused', () => {
  const Action = createAction('My Type');

  // @ts-expect-error no payload allowed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errorActionInstance = new Action({});
  const actionInstance = new Action();

  expect(actionInstance).toEqual({});
});

it('should create a class constructor without props when propsType is withoutProps', () => {
  const Action = createAction('My Type', withoutProps());

  // @ts-expect-error no payload allowed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const errorActionInstance = new Action({});
  const actionInstance = new Action();

  expect(actionInstance).toEqual({});
});

it('should not allow properties to be modified', () => {
  const Action = createAction('My Type', withProps<{ animal: string }>());
  const actionInstance = new Action({ animal: 'Panda' });

  expect(() => {
    actionInstance.animal = 'Owlbear';
  }).toThrowError(TypeError);
});
