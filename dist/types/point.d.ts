export class Point {
  x: number;
  y: number;
  type: string;
  constructor(x: number, y: number);
  add(that: Point) : Point;
  addEquals(that: Point) : Point;
  scalarAdd(scalar : number) : Point;
  scalarAddEquals(scalar: number) : Point;
  subtract(that: Point) : Point;
  subtractEquals(that: Point) : Point;
  scalarSubtract(scalar: number) : Point;
  scalarSubtractEquals(scalar: number) : Point;
  multiply(scalar: number) : Point;
  multiplyEquals(scalar: number) : Point;
  divide(scalar: number) : Point;
  divideEqual(scalar: number) : Point;
  eq(that: Point) : boolean;
  lt(that: Point) : boolean;
  lte(that: Point) : boolean;
  gt(that: Point) : boolean;
  gte(that: Point) : boolean;
  lerp(that: Point, t: number) : Point;
  distanceFrom(that: Point) : number;
  midPointFrom(that: Point) : Point;
  min(that: Point) : Point;
  max(that: Point) : Point;
  toString(): string;
  setXY(x: number, y: number):Point;
  setX(x:number) :Point;
  setY(y: number) : Point;
  setFromPoint(that : Point) : Point
  swap(that: Point) : void;
  clone() : Point;
}
