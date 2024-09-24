export type VerticalLine = {
    x: number;
    y1: number;
    y2: number;
};
export type HorizontalLine = {
    y: number;
    x1: number;
    x2: number;
};
export type VerticalLineProps = {
    x: number;
    objectY: number;
    objectHeight: number;
    activeObjectY: number;
    activeObjectHeight: number;
};
export type HorizontalLineProps = {
    y: number;
    objectX: number;
    objectWidth: number;
    activeObjectX: number;
    activeObjectWidth: number;
};
export type AligningLineConfig = {
    /** At what distance from the shape does alignment begin? */
    margin: number;
    /** Aligning line dimensions */
    width: number;
    /** Aligning line color */
    color: string;
};
//# sourceMappingURL=typedefs.d.ts.map