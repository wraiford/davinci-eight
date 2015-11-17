import CubicBezierCurve = require('../curves/CubicBezierCurve')
import Curve = require('../curves/Curve')
import CurvePath = require('../curves/CurvePath')
import Euclidean3 = require('../math/Euclidean3')
import isClockWise = require('../geometries/isClockWise')
import LineCurve = require('../curves/LineCurve')
import PathAction = require('../geometries/PathAction')
import PathArgs = require('../geometries/PathArgs')
import PathKind = require('../geometries/PathKind')
import QuadraticBezierCurve = require('../curves/QuadraticBezierCurve')
import Shape = require('../geometries/Shape')
import SplineCurve = require('../curves/SplineCurve')

/**
 * @class Path
 */
class Path extends CurvePath {

    public actions: PathAction[];
    private useSpacedPoints: boolean;

    /**
     * <code>Path</code> is a utility for buiding a <em>path</em> of points.
     * @class Path
     * @constructor
     */
    constructor(points?: Euclidean3[]) {
        super()
        this.actions = []
        if (points) {
            this.fromPoints(points)
        }
    }

    /**
     * @method fromPoints
     * @return {void}
     */
    fromPoints(points: Euclidean3[]): void {
        if (points.length > 0) {
            this.moveTo(points[0]);
            for (var i = 1, iLength = points.length; i < iLength; i++) {
                this.lineTo(points[i])
            }
        }
    }

    /**
     * @method getSpacedPoints
     * @param [divisions = 40] {number}
     * @param closedPath [boolean]
     * @return {Euclidean3[]}
     */
    getSpacedPoints(divisions: number = 40, closedPath?: boolean): Euclidean3[] {
        var points: Euclidean3[] = []
        for (var i = 0; i < divisions; i++) {
            points.push(this.getPoint(i / divisions))
        }
        // if ( closedPath ) {
        //
        //   points.push( points[ 0 ] )
        //
        // }
        return points
    }

    /**
     * @method getPoints
     * @param [divisiions = 12] {number}
     * @param closedPath [boolean]
     * @return {Euclidean3[]}
     */
    getPoints(divisions?: number, closedPath?: boolean): Euclidean3[] {

        if (this.useSpacedPoints) {
            return this.getSpacedPoints(divisions, closedPath);
        }

        divisions = divisions || 12;

        var points: Euclidean3[] = [];
        var beginPoint: Euclidean3;
        var controlBegin: Euclidean3;
        var endPoint: Euclidean3;
        var controlEnd: Euclidean3;

        for (let i = 0, il = this.actions.length; i < il; i++) {

            let item: PathAction = this.actions[i];

            let action: string = item.action;
            let data: PathArgs = item.data;

            switch (action) {

                case PathKind.MOVE_TO:
                    points.push(data.endPoint)
                    break;
                case PathKind.LINE_TO:
                    points.push(data.endPoint)
                    break;
                case PathKind.QUADRATIC_CURVE_TO:
                    controlBegin = data.controlBegin
                    endPoint = data.endPoint
                    if (points.length > 0) {
                        beginPoint = points[points.length - 1]
                    }
                    else {
                        beginPoint = this.actions[i - 1].data.endPoint;
                    }
                    for (var j = 1; j <= divisions; j++) {
                        points.push(beginPoint.quadraticBezier(j / divisions, controlBegin, endPoint))

                    }

                    break;

                case PathKind.BEZIER_CURVE_TO:
                    controlBegin = data.controlBegin
                    controlEnd = data.controlEnd;
                    endPoint = data.endPoint

                    if (points.length > 0) {

                        beginPoint = points[points.length - 1];
                    }
                    else {
                        beginPoint = this.actions[i - 1].data.endPoint;
                    }
                    for (j = 1; j <= divisions; j++) {
                        points.push(beginPoint.cubicBezier(j / divisions, controlBegin, controlEnd, endPoint));
                    }

                    break;

                case PathKind.CSPLINE_THRU:
                    /*
                    let laste = this.actions[i - 1].data;

                    var last = new Vector2(laste[laste.length - 2], laste[laste.length - 1]);
                    var spts: Euclidean3 = [last];

                    var n = divisions * data[0].length;

                    spts = spts.concat(args[0]);

                    var spline = new SplineCurve(spts);

                    for (j = 1; j <= n; j++) {

                        points.push(spline.getPointAt(j / n));

                    }
                    */
                    break;

                case PathKind.ARC:
                    /*
                    endPoint = data.endPoint;  // a is the center of the arc
                    var aRadius = data.radius;
                    var aStartAngle = args[3];
                    var aEndAngle = args[4];
                    var aClockwise = !!args[5];

                    var deltaAngle = aEndAngle - aStartAngle;
                    var angle;
                    var tdivisions = divisions * 2;

                    for (j = 1; j <= tdivisions; j++) {

                        t = j / tdivisions;

                        if (!aClockwise) {

                            t = 1 - t;

                        }

                        angle = aStartAngle + t * deltaAngle;

                        tx = aX + aRadius * Math.cos(angle);
                        ty = aY + aRadius * Math.sin(angle);

                        //console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

                        points.push(new Vector2(tx, ty));

                    }

                    //console.log(points);
                    */
                    break;

                case PathKind.ELLIPSE:
                    /*
                    var aX = args[0], aY = args[1],
                        xRadius = args[2],
                        yRadius = args[3],
                        aStartAngle = args[4], aEndAngle = args[5],
                        aClockwise = !!args[6];


                    var deltaAngle = aEndAngle - aStartAngle;
                    var angle;
                    var tdivisions = divisions * 2;

                    for (j = 1; j <= tdivisions; j++) {

                        t = j / tdivisions;

                        if (!aClockwise) {

                            t = 1 - t;

                        }

                        angle = aStartAngle + t * deltaAngle;

                        tx = aX + xRadius * Math.cos(angle);
                        ty = aY + yRadius * Math.sin(angle);

                        //console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

                        points.push(new Vector2(tx, ty));

                    }

                    //console.log(points);
                    */
                    break;

            } // end switch

        }



        // Normalize to remove the closing point by default.
        var firstPoint = points[0]
        var lastPoint = points[points.length - 1]
        lastPoint.distanceTo(firstPoint)
        var EPSILON = 0.0000000001;

        if (lastPoint.distanceTo(firstPoint) < EPSILON) {
            points.splice(points.length - 1, 1);
        }

        if (closedPath) {
            points.push(points[0]);
        }
        return <Euclidean3[]>points;
    };

    execute(action: string, args: PathArgs): void {
        // switch on the action and call the method.
        throw new Error("TODO Path.execute")
    }

    /**
     * @method moveTo
     * @param point {Euclidean3}
     * @return {void}
     */
    moveTo(point: Euclidean3): void {
        this.actions.push({ action: PathKind.MOVE_TO, data: { endPoint: point } })
    }

    /**
     * @method lineTo
     * @param point {Euclidean3}
     * @return {void}
     */
    lineTo(point: Euclidean3) {
        var prevArgs: PathArgs = this.actions[this.actions.length - 1].data;
        var beginPoint: Euclidean3 = prevArgs.endPoint;
        var curve = new LineCurve(beginPoint, point);
        this.curves.push(curve);
        this.actions.push({ action: PathKind.LINE_TO, data: { endPoint: point } });
    }

    /**
     * @method quadraticCurveTo
     * @param controlPoint {Euclidean3}
     * @param endPoint {Euclidean3}
     * @return {void}
     */
    quadraticCurveTo(controlPoint: Euclidean3, point: Euclidean3): void {
        var prevArgs: PathArgs = this.actions[this.actions.length - 1].data;
        var beginPoint = prevArgs.endPoint;
        var curve = new QuadraticBezierCurve(beginPoint, controlPoint, point)
        this.curves.push(curve);
        this.actions.push({ action: PathKind.QUADRATIC_CURVE_TO, data: { controlBegin: controlPoint, endPoint: point } });
    }

    /**
     * @method bezierCurveTo
     * @param controlBegin {Euclidean3}
     * @param controlEnd {Euclidean3}
     * @param endPoint {Euclidean3}
     * @return {void}
     */
    bezierCurveTo(controlBegin: Euclidean3, controlEnd: Euclidean3, point: Euclidean3): void {
        var prevArgs: PathArgs = this.actions[this.actions.length - 1].data;
        var beginPoint = prevArgs.endPoint;
        var curve = new CubicBezierCurve(beginPoint, controlBegin, controlEnd, point)
        this.curves.push(curve);
        this.actions.push({ action: PathKind.BEZIER_CURVE_TO, data: { controlBegin: controlBegin, controlEnd: controlEnd, endPoint: point } });
    }
    //
    // Breaks path into shapes
    //
    //  Assumptions (if parameter isCCW==true the opposite holds):
    //  - solid shapes are defined clockwise (CW)
    //  - holes are defined counterclockwise (CCW)
    //
    //  If parameter noHoles==true:
    //  - all subPaths are regarded as solid shapes
    //  - definition order CW/CCW has no relevance
    //

    toShapes(isCCW?: boolean, noHoles?: boolean) {

        function extractSubpaths(inActions: PathAction[]) {

            var subPaths: Path[] = [];
            var lastPath: Path = new Path();

            for (var i = 0, il = inActions.length; i < il; i++) {

                let action: PathAction = inActions[i];

                let args: PathArgs = action.data;
                let kind: string = action.action; // FIXME => kind

                if (kind === PathKind.MOVE_TO) {
                    if (lastPath.actions.length != 0) {
                        subPaths.push(lastPath);
                        lastPath = new Path();
                    }
                }
                lastPath.execute(kind, args)
            }
            if (lastPath.actions.length != 0) {
                subPaths.push(lastPath);
            }
            return subPaths;
        }

        function toShapesNoHoles(inSubpaths: Path[]) {

            var shapes: Shape[] = [];

            for (var i = 0, il = inSubpaths.length; i < il; i++) {

                var tmpPath = inSubpaths[i];

                var tmpShape = new Shape();
                tmpShape.actions = tmpPath.actions;
                tmpShape.curves = tmpPath.curves;

                shapes.push(tmpShape);
            }

            //console.log("shape", shapes);

            return shapes;
        };

        function isPointInsidePolygon(inPt: Euclidean3, inPolygon: Euclidean3[]): boolean {
            var EPSILON = 0.0000000001;

            var polyLen = inPolygon.length;

            // inPt on polygon contour => immediate success    or
            // toggling of inside/outside at every single! intersection point of an edge
            //  with the horizontal line through inPt, left of inPt
            //  not counting lowerY endpoints of edges and whole edges on that line
            var inside = false;
            for (var p = polyLen - 1, q = 0; q < polyLen; p = q++) {
                var edgeLowPt = inPolygon[p];
                var edgeHighPt = inPolygon[q];

                var edgeDx = edgeHighPt.x - edgeLowPt.x;
                var edgeDy = edgeHighPt.y - edgeLowPt.y;

                if (Math.abs(edgeDy) > EPSILON) {      // not parallel
                    if (edgeDy < 0) {
                        edgeLowPt = inPolygon[q]; edgeDx = - edgeDx;
                        edgeHighPt = inPolygon[p]; edgeDy = - edgeDy;
                    }
                    if ((inPt.y < edgeLowPt.y) || (inPt.y > edgeHighPt.y)) continue;

                    if (inPt.y == edgeLowPt.y) {
                        if (inPt.x == edgeLowPt.x) return true;    // inPt is on contour ?
                        // continue;        // no intersection or edgeLowPt => doesn't count !!!
                    } else {
                        var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                        if (perpEdge == 0) return true;    // inPt is on contour ?
                        if (perpEdge < 0) continue;
                        inside = !inside;    // true intersection left of inPt
                    }
                } else {    // parallel or colinear
                    if (inPt.y != edgeLowPt.y) continue;      // parallel
                    // egde lies on the same horizontal line as inPt
                    if (((edgeHighPt.x <= inPt.x) && (inPt.x <= edgeLowPt.x)) ||
                        ((edgeLowPt.x <= inPt.x) && (inPt.x <= edgeHighPt.x))) return true;  // inPt: Euclidean3 on contour !
                    // continue;
                }
            }

            return inside;
        }


        var subPaths = extractSubpaths(this.actions);
        if (subPaths.length == 0) return [];

        if (noHoles === true) return toShapesNoHoles(subPaths);


        var solid: boolean;
        var tmpPath: Path;
        var tmpShape: Shape;
        var shapes: Shape[] = [];

        if (subPaths.length == 1) {

            tmpPath = subPaths[0];
            tmpShape = new Shape();
            tmpShape.actions = tmpPath.actions;
            tmpShape.curves = tmpPath.curves;
            shapes.push(tmpShape);
            return shapes;

        }

        var holesFirst = !isClockWise(subPaths[0].getPoints());
        holesFirst = isCCW ? !holesFirst : holesFirst;

        // console.log("Holes first", holesFirst);
  
        var betterShapeHoles: { h: Path; p: Euclidean3 }[][] = [];
        var newShapes: { s: Shape; p: Euclidean3[] }[] = [];
        var newShapeHoles: { h: Path; p: Euclidean3 }[][] = [];
        var mainIdx = 0;
        var tmpPoints: Euclidean3[];

        newShapes[mainIdx] = undefined;
        newShapeHoles[mainIdx] = [];

        for (let i = 0, il = subPaths.length; i < il; i++) {

            tmpPath = subPaths[i];
            tmpPoints = tmpPath.getPoints();
            solid = isClockWise(tmpPoints);
            solid = isCCW ? !solid : solid;

            if (solid) {

                if ((!holesFirst) && (newShapes[mainIdx])) mainIdx++;

                newShapes[mainIdx] = { s: new Shape(), p: tmpPoints };
                newShapes[mainIdx].s.actions = tmpPath.actions;
                newShapes[mainIdx].s.curves = tmpPath.curves;

                if (holesFirst) mainIdx++;
                newShapeHoles[mainIdx] = [];

                //console.log('cw', i);

            } else {

                newShapeHoles[mainIdx].push({ h: tmpPath, p: tmpPoints[0] });

                //console.log('ccw', i);

            }

        }

        // only Holes? -> probably all Shapes with wrong orientation
        if (!newShapes[0]) return toShapesNoHoles(subPaths);


        if (newShapes.length > 1) {
            var ambigious = false;
            var toChange: { froms: number; tos: number; hole: number }[] = [];

            for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                betterShapeHoles[sIdx] = [];
            }
            for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                var sho = newShapeHoles[sIdx];
                for (var hIdx = 0; hIdx < sho.length; hIdx++) {
                    var ho = sho[hIdx];
                    var hole_unassigned = true;
                    for (var s2Idx = 0; s2Idx < newShapes.length; s2Idx++) {
                        if (isPointInsidePolygon(ho.p, newShapes[s2Idx].p)) {
                            if (sIdx != s2Idx) toChange.push({ froms: sIdx, tos: s2Idx, hole: hIdx });
                            if (hole_unassigned) {
                                hole_unassigned = false;
                                betterShapeHoles[s2Idx].push(ho);
                            } else {
                                ambigious = true;
                            }
                        }
                    }
                    if (hole_unassigned) { betterShapeHoles[sIdx].push(ho); }
                }
            }
            // console.log("ambigious: ", ambigious);
            if (toChange.length > 0) {
                // console.log("to change: ", toChange);
                if (!ambigious) newShapeHoles = betterShapeHoles;
            }
        }

        var tmpHoles: { h: Path; p: Euclidean3 }[];
        for (let i = 0, il = newShapes.length; i < il; i++) {
            tmpShape = newShapes[i].s;
            shapes.push(tmpShape);
            tmpHoles = newShapeHoles[i];
            for (var j = 0, jl = tmpHoles.length; j < jl; j++) {
                tmpShape.holes.push(tmpHoles[j].h);
            }
        }

        //console.log("shape", shapes);

        return shapes;
    }
}
export = Path