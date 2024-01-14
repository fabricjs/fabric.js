# Layout manager

Layout manager exposes a main public method that performs group layout given a target group and target objects.

## performLayout

Each performLayout call gets a context, the context has always

- type, a string used for behaviour switch
- target, the group we are performing a layout onto and that will be modified
- targets, the objects participating in the layout operation, that will be modified

Other properties change with the type of performLayout

this is the call flow:

performLayout -> onBeforeLayout -> getLayoutResult -> commitLayout -> onAfterLayout

The flow has the following goals/features:

- alerting the user a layout ends and finish
- subscribe to object events in order to preform layout on change
- calculate group new size and position
- move the objects to their new position relative to the group center.

### Design Topics TBD

- Should layout trigger also on changes to objects like `strokeWidth`, `fontSize` etc.?
- Should changes to clip path perform layout in case of clip path layout strategy?
- Should `layoutObjects`/`layoutObject` move from `LayoutManager` to `LayoutStrategy`? What about subscription logic?

### type INITIALIZATION

When a group is created, all objects gets flagged with the group property set to the new group, then an instance of a layout manager is used to calculate the bounding box.

onBeforeLayout will

- subscribe every object, setting the unsubscribe callback to a map inside the LayoutManager state.
  Subscription will bind to specific events more calls to layout, with specific types.
- fire an user event

getLayoutResult will return an object that contains:

- result of strategy.calcLayoutResult
- nextCenter ( that is part of result, duplicate )
- prevCenter 0,0 in case of INITIALIZATION
- offset calculated with prevCenter, nextCenter and various switches

commitLayout will get the above results and

- set width/height of the group
- set the group top/left by either the passed in x/y or the nextCenter value

onAfterLayout will

- fire an user event
- reset the group transform if the group is empty ( why? )
- bubble the performLayout to parent groups

### notes

- i can select an object in the group
- i can select an object in the group and i can transform ( rotate, scale, resize, move, flip?, editText )
- i can multiselect one more more objects inside the group
- if i select object A, B i can't select any parent of A, B and this is blocked by the code so that the selection won't actually happen

between 2 groups - multiselection

- i can select object A and object B from 2 different groups
- i can select object A and object B from 2 different groups and i can transform them as the single group case

- a group with a single object and is interactivity needs to be defined.

#### ADD REMOVE

when i add an object to an existing group the object is added in the group so that the other objects do not move apparently, and the bounding box of the existing group is extended to cover the new object but it doesn't change its rotation.

When we say group.remove(A) A is removed from the group and the transform state of A absorb the transform state of the group so that if added back to the scene its visual state doesn't change.

A node can't be on two different trees.

### Events

Resolve the namespace off issue
