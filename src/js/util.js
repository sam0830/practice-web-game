'use strict';

var Util = function() {};

Util.inherit = function(child, parent) {
    var getPrototype = function(p) {
        if(Object.create) {
            return Object.create(p);
        }

        var F = function() {};
        F.prototype = p;
        return new F();
    };
    child.prototype = getPrototype(parent.prototype);
    child.prototype.constructor = child;
};

Util.thetaToRadian = function(theta) {
    return theta * Math.PI / 180;
};

Util.radianToTheta = function(radian) {
    return (radian * 180 /Math.PI) | 0;
};

Util.calcMoveX = function(speed, theta) {
    return speed * Math.cos(Util.thetaToRadian(theta));
};

Util.calcMoveY = function(speed, theta) {
    return speed * Math.sin(Util.thetaToRadian(theta));
};
module.exports = Util;
