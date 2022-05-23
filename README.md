# NGXS Action Creator

Create class-based Actions for use in NGXS

## Why

Without this library, every developer has to re-create the correct definitions
for every Action they create.

This library helps create actions and groups of actions with strong typing and convenience.

## `createAction`

Create a single action without props:

```ts
import { createAction } from 'ngxs-action-creator';

const FeedAnimals = createAction('[Zoo] Feed Animals')

const actionInstance = new FeedAnimals();

// As a caveat, because anonymous classes are used, the type of the action
// in a state's action handler is inconvenient to write:
class State {
  @Action(FeedAnimals)
  feedAnimals(ctx: StateContext<{}>, action: InstanceType<FeedAnimals>) {
    // feed animals
  }
}
```

Create a single action with props:

```ts
import { createAction } from 'ngxs-action-creator';
import { withProps } from './createAction';

const AddAnimal = createAction('[Zoo] Add Animal', withProps<{ animal: string }>())

const actionInstance = new AddAnimal({ animal: 'Panda' });

// As a convenience, the constructor always takes a single object and will spread
// the object's properties into the action instance
console.log(actionInstance.animal);
```

### `createActionGroup`

Actions usually come in herds, so you can also create many at once:

```ts
const { FeedTheAnimals, AddAnimal, RemoveAnimal } = createActionGroup('Zoo', {
  'Feed the Animals': withoutProps(),
  'Add Animal': withProps<{ animal: string }>(),
  'Remove Animal': withProps<{ animal: string }>(),
});

// Do note that the casing in the keys will be kept, 
// but the resulting action class names are capitalized
console.log(FeedTheAnimals.type === '[Zoo] Feed the Animals')
```

### `useActions`

Since adding types to every Action Handler becomes slightly more inconvenient with actions
created by `createAction` or `createActionGroup`, you may find `useActions` useful:

```ts
@State<ZooStateModel>({ name: 'zoo', defaults: { animals: [] } })
class ZooState {
  constructor() {
    const on = useActions<ZooStateModel>(this);

    on(AddAnimal, (ctx, { animal }) => {
      const { animals } = ctx.getState();
      ctx.patchState({ animals: [...animals, animal] });
    });
    on(RemoveAnimal, (ctx, { animal }) => {
      const { animals } = ctx.getState();
      ctx.patchState({ animals: animals.filter((a) => a !== animal) });
    });
    on([AddAnimal, RemoveAnimal], (ctx, { animal }) => { console.log(animal) })
  }
}
```

Note that you can still create actions using the `@Action` annotation on class methods.
The two approaches are compatible.

### Complete Example

With this Library:

```ts
import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';
import { createActionGroup, useActions, withProps } from 'ngxs-action-creator';

const { AddAnimal, RemoveAnimal } = createActionGroup('Zoo', {
  'Add Animal': withProps<{ animal: string }>(),
  'Remove Animal': withProps<{ animal: string }>(),
});

interface ZooStateModel {
  animals: string[];
}

@Injectable()
@State<ZooStateModel>({ name: 'zoo', defaults: { animals: [] } })
class ZooState {
  constructor() {
    const on = useActions<ZooStateModel>(this);

    on(AddAnimal, (ctx, { animal }) => {
      const { animals } = ctx.getState();
      ctx.patchState({ animals: [...animals, animal] });
    });
    on(RemoveAnimal, (ctx, { animal }) => {
      const { animals } = ctx.getState();
      ctx.patchState({ animals: animals.filter((a) => a !== animal) });
    });
  }
}

```

Without this Library:

```ts
import {Action, State, StateContext} from '@ngxs/store';
import {Injectable} from "@angular/core";

class AddAnimal {
  static readonly type = '[Zoo] Add Animal';
  public readonly animal: string;

  constructor(payload: { animal: string }) {
    this.animal = payload.animal
  }
}

class RemoveAnimal {
  static readonly type = '[Zoo] Add Animal';
  public readonly animal: string;

  constructor(payload: { animal: string }) {
    this.animal = payload.animal
  }
}

interface ZooStateModel {
  animals: string[]
}

@Injectable()
@State<ZooStateModel>({ name: 'zoo', defaults: { animals: [] } })
export class ZooState {
  @Action(AddAnimal)
  addAnimal(ctx: StateContext<ZooStateModel>, action: AddAnimal) {
    const { animals } = ctx.getState();
    ctx.patchState({ animals: [...animals, action.animal] })
  }

  @Action(RemoveAnimal)
  removeAnimal(ctx: StateContext<ZooStateModel>, action: RemoveAnimal) {
    const { animals } = ctx.getState();
    ctx.patchState({ animals: animals.filter(a => a !== action.animal)})
  }
}
```

## Inspiration & Additional Resources

This library is heavily inspired by (and some code taken from) ngrx, 
especially [createActionGroup](https://dev.to/ngrx/ngrx-action-group-creator-1deh),
and adapted to work with class based actions.

After implementing `useActions` to solve the inconvenience with the action's type 
in action handlers, I also realized that similar work has been done in
[@ngxs-labs/attach-action](https://github.com/ngxs-labs/attach-action).
That library is incompatible with actions created by this library.
