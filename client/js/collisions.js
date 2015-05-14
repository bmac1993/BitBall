"use strict"

function checkCollisions(circle,rect)
{
	var closestX = clamp(circle.x,rect.x,rect.x - rect.radius);
	var closestY = clamp(circle.y,rect.y,rect.y - rect.radius);
	
	var distanceX = circle.x - closestX;
	var distanceY = circle.y - closestY;
	
	var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
	return (distanceSquared < (circle.radius * circle.radius));
}

function checkCollisionsCirc(circle1,circle2)
{
	var d = Math.sqrt((Math.pow(circle2.x - circle1.x,2) + Math.pow(circle2.y - circle1.y,2)));
	return (d < (circle1.radius + circle2.radius));
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]

function isPointInPoly(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}