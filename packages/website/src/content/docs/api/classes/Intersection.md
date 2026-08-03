---
editUrl: false
next: false
prev: false
title: "Intersection"
---

Defined in: [src/Intersection.ts:8](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L8)

## Constructors

### Constructor

> **new Intersection**(`status?`): `Intersection`

Defined in: [src/Intersection.ts:13](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L13)

#### Parameters

##### status?

[`IntersectionType`](/api/type-aliases/intersectiontype/)

#### Returns

`Intersection`

## Properties

### points

> **points**: [`Point`](/api/classes/point/)[]

Defined in: [src/Intersection.ts:9](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L9)

***

### status?

> `optional` **status**: [`IntersectionType`](/api/type-aliases/intersectiontype/)

Defined in: [src/Intersection.ts:11](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L11)

## Methods

### intersectLineLine()

> `static` **intersectLineLine**(`a1`, `a2`, `b1`, `b2`, `aInfinite?`, `bInfinite?`): `Intersection`

Defined in: [src/Intersection.ts:125](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L125)

Checks if a line intersects another

#### Parameters

##### a1

[`Point`](/api/classes/point/)

##### a2

[`Point`](/api/classes/point/)

##### b1

[`Point`](/api/classes/point/)

##### b2

[`Point`](/api/classes/point/)

##### aInfinite?

`boolean` = `true`

check segment intersection by passing `false`

##### bInfinite?

`boolean` = `true`

check segment intersection by passing `false`

#### Returns

`Intersection`

#### See

 - [line intersection](https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection)
 - [Cramer's rule](https://en.wikipedia.org/wiki/Cramer%27s_rule)

***

### intersectLinePolygon()

> `static` **intersectLinePolygon**(`a1`, `a2`, `points`, `infinite?`): `Intersection`

Defined in: [src/Intersection.ts:219](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L219)

Checks if line intersects polygon

#### Parameters

##### a1

[`Point`](/api/classes/point/)

point on line

##### a2

[`Point`](/api/classes/point/)

other point on line

##### points

[`Point`](/api/classes/point/)[]

polygon points

##### infinite?

`boolean` = `true`

check segment intersection by passing `false`

#### Returns

`Intersection`

#### Todo

account for stroke

#### See

[intersectSegmentPolygon](/api/classes/intersection/#intersectsegmentpolygon) for segment intersection

***

### intersectPolygonPolygon()

> `static` **intersectPolygonPolygon**(`points1`, `points2`): `Intersection`

Defined in: [src/Intersection.ts:270](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L270)

Checks if polygon intersects another polygon

#### Parameters

##### points1

[`Point`](/api/classes/point/)[]

##### points2

[`Point`](/api/classes/point/)[]

#### Returns

`Intersection`

#### Todo

account for stroke

***

### intersectPolygonRectangle()

> `static` **intersectPolygonRectangle**(`points`, `r1`, `r2`): `Intersection`

Defined in: [src/Intersection.ts:307](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L307)

Checks if polygon intersects rectangle

#### Parameters

##### points

[`Point`](/api/classes/point/)[]

polygon points

##### r1

[`Point`](/api/classes/point/)

top left point of rect

##### r2

[`Point`](/api/classes/point/)

bottom right point of rect

#### Returns

`Intersection`

#### See

[intersectPolygonPolygon](/api/classes/intersection/#intersectpolygonpolygon) for polygon intersection

***

### intersectSegmentLine()

> `static` **intersectSegmentLine**(`s1`, `s2`, `l1`, `l2`): `Intersection`

Defined in: [src/Intersection.ts:180](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L180)

Checks if a segment intersects a line

#### Parameters

##### s1

[`Point`](/api/classes/point/)

boundary point of segment

##### s2

[`Point`](/api/classes/point/)

other boundary point of segment

##### l1

[`Point`](/api/classes/point/)

point on line

##### l2

[`Point`](/api/classes/point/)

other point on line

#### Returns

`Intersection`

#### See

[intersectLineLine](/api/classes/intersection/#intersectlineline) for line intersection

***

### intersectSegmentPolygon()

> `static` **intersectSegmentPolygon**(`a1`, `a2`, `points`): `Intersection`

Defined in: [src/Intersection.ts:253](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L253)

Checks if segment intersects polygon

#### Parameters

##### a1

[`Point`](/api/classes/point/)

boundary point of segment

##### a2

[`Point`](/api/classes/point/)

other boundary point of segment

##### points

[`Point`](/api/classes/point/)[]

polygon points

#### Returns

`Intersection`

#### See

[intersectLinePolygon](/api/classes/intersection/#intersectlinepolygon) for line intersection

***

### intersectSegmentSegment()

> `static` **intersectSegmentSegment**(`a1`, `a2`, `b1`, `b2`): `Intersection`

Defined in: [src/Intersection.ts:198](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L198)

Checks if a segment intersects another

#### Parameters

##### a1

[`Point`](/api/classes/point/)

boundary point of segment

##### a2

[`Point`](/api/classes/point/)

other boundary point of segment

##### b1

[`Point`](/api/classes/point/)

boundary point of segment

##### b2

[`Point`](/api/classes/point/)

other boundary point of segment

#### Returns

`Intersection`

#### See

[intersectLineLine](/api/classes/intersection/#intersectlineline) for line intersection

***

### isPointContained()

> `static` **isPointContained**(`T`, `A`, `B`, `infinite?`): `boolean`

Defined in: [src/Intersection.ts:50](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L50)

check if point T is on the segment or line defined between A and B

#### Parameters

##### T

[`Point`](/api/classes/point/)

the point we are checking for

##### A

[`Point`](/api/classes/point/)

one extremity of the segment

##### B

[`Point`](/api/classes/point/)

the other extremity of the segment

##### infinite?

`boolean` = `false`

if true checks if `T` is on the line defined by `A` and `B`

#### Returns

`boolean`

true if `T` is contained

***

### isPointInPolygon()

> `static` **isPointInPolygon**(`point`, `points`): `boolean`

Defined in: [src/Intersection.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Intersection.ts#L90)

Use the ray casting algorithm to determine if point is in the polygon defined by points

#### Parameters

##### point

[`Point`](/api/classes/point/)

##### points

[`Point`](/api/classes/point/)[]

polygon points

#### Returns

`boolean`

#### See

https://en.wikipedia.org/wiki/Point_in_polygon
