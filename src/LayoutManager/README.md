# Layout manager

Layout manager exposes a main public method that perform group layouting given a target group and target objects.

## performLayout

Each performLayout call gets a context, the context has always

- type, a string used for behaviour switch
- target, the group we are performing a layout onto and that will be modified
- targets, the objects partecipating in the layout operation, that will be modified

Other properties change with the type of performLayout

this is the call flow:

performLayout -> onBeforeLayout -> getLayoutResult -> commitLayout -> onAfterLayout

The flow has the following goals/features:

- alerting the user a layout ends and finish
- subscribe to object events in order to continue layouting later
- calculate group new size and position
- move the objects to their new position relative to the group center.

**Note**: the option `objectsRelativeToGroup` is related to restoring a group from serialization and should be removed. Object should be eventually normalized in the from Object function or we should ask why do we want to perform a layout if the group has been saved with the layout properties already calculated.

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
- offset calculated with prevCenter, nextCenter and various switches ( needs semplification removing `objectsRelativeToGroup`)

commitLayout will get the above results and

- set width/height of the group
- set the position of all objects ( unless we are coming from `objectsRelativeToGroup`)
- set the group top/left by either the passed in x/y or the nextCenter value

onAfterLayout will

- fire an user event
- reset the group transform if the group is empty ( why? )
- bubble the performLayout to parent groups
