# Layout manager

Layout manager exposes a main public method that performs group layout given a target group and target objects.

## Expectations for non interactive groups

The layout manager will calculate the size and position of the group when is created or updated
The FitContent strategy is the classic fabric 5.x group and will grow or shrink when objects are added or removed.
In general the expectation is that wrapping objects in a group without specifying a new postion or transformations wont change the object visual position, the position of the objects will be the same that those object would have had on the canvas if they weren't on the group. Theyr coordinates will change to adapt to the group structure.
This is a legacy behaviour that carries over this new code.
The behaviour is not important if you are building a group from scratch and you are adding it in a specific position or requesting a specific transform ( scaleX, angle, etc ). In that case the original position is meaningless and is overridden with your transform.

Since inside the group all objects are organized around the center is anyway easier if you can think of your objects position and alignment with scene coordinates and know that they will be maintained in the same relative position when grouped.

### FitContent strategy

When a group is created, FitContent strategy will consider all the objects in the group, find their bounding box, find the center of the bounding box, and assign those to the group.

When a new object is added or removed, a new bounding box is calculated, a new center is found, all the remaining objects are moved by an offset so that are re-positioned around the new center

### Fixed layout strategy

With the fixed layout a Developer can specify either width or height and have the other calculated.
If the developer specifies both dimensions of the box, the bounding box is still calculated to obtain the center.
Once the group is initialized with a fixed layout, adding new objects won't change the group's size and therefore also its position.
The layout is fixed, is cropped by the bounding box itself.
When larger or smaller than the actual boundingbox the group is centered on the initial center of the initial set of objects and the fixed bounding box extends from the center.

The Fixed layout strategy is the only strategy in which the developer can change the width and height of the group at will without having it reset when adding or removing objects.

It must be clear that is also possible change width and height of the group in the other cases, but that is an ephemeral change that gets resetted at the next performLayout

### Clippath layout strategy

The Clippath layout keeps the group around the clipath rather than the objects. The group will be as large as the clipPath, the center of the group will be the center of the clippath.
This layout is clippath dependentent

WARNING needs fix:
The behaviour of this layout is currently broken if we want.
The center of the group is the center of the clipPath visually but the position of the clipPath compared to the object on the canvas is hard to predict as it is now

## Expectations for interactive groups

TBD

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
