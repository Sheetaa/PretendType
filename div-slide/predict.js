F.module('king:ucenter/predict', function (require, exports, ctx) {
    var DURATION = 620;
    var DISTANCE = 232.5;
    var $stage = $('.v-center-predict .section');
    var $lis = $stage.find('li');
    var NUM = $lis.length;

    var slice = Array.prototype.slice;
    var startTime;
    var index, tarIndex, curPos, tarPos;

    var requestAnimationFrame = (function () {
        return window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || function (callback) {
                return setTimeout(callback, 1000 / 60);
            };
    })();

    function _unit () {
        index = _getCurIndex();
        tarIndex = (index + 4) % NUM;
        curPos = DISTANCE * index;
        tarPos = DISTANCE * tarIndex;
        _animation(index, tarIndex);
    }

    function _getCurIndex () {
        return parseInt($stage.find('.cur-page').data('page'), 10);
    }

    function _animation (index, tarIndex) {
        startTime = new Date();
        requestAnimationFrame(_timeHandler);
    }

    function _timeHandler () {
        var timePast = new Date() - startTime;
        if (timePast >= DURATION) {
            _tick(1);
        } else {
            _tick(timePast / DURATION);
            requestAnimationFrame(_timeHandler);
        }
    }

    function _tick (percent) {
        var move = (tarPos - curPos) * percent;
        $stage.scrollLeft(curPos + move);
    }


    exports.init = function () {
        var $change = $('.v-center-predict h3 a');
        $change.on('click', function (e) {
            e.preventDefault();
            _unit();

            $lis.eq(index).removeClass('cur-page');
            $lis.eq(tarIndex).addClass('cur-page');
        });
    };
});
