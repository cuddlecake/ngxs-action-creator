import { withoutProps, withProps } from './createAction';
import { createActionGroup } from './createActionGroup';

it('should add type including source', () => {
  const actionGroup = createActionGroup('Source', {
    'do thing': withProps<{ prop1: string; prop2: number }>(),
  });

  const action = new actionGroup.DoThing({ prop1: 'the property', prop2: 5 });
  expect(actionGroup.DoThing.type).toBe('[Source] do thing');
  expect(action.prop1).toBe('the property');
  expect(action.prop2).toBe(5);
});

it('should support multiple actions', () => {
  const actionGroup = createActionGroup('Source', {
    'Do Thing 1': withProps<{ prop1: string }>(),
    'Do Thing 2': withProps<{ prop2: string }>(),
  });

  expect(actionGroup).toHaveProperty('DoThing1');
  expect(actionGroup).toHaveProperty('DoThing2');
});

it('should support actions without props', () => {
  const actionGroup = createActionGroup('Source', {
    'Do Thing 1': withoutProps(),
  });

  expect(new actionGroup.DoThing1()).toEqual({});
});
