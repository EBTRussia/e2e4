define(['ko', 'jquery', 'underscore', 'jquery.mousewheel'], function (ko, jquery, _)
{
    'use strict';
    ko.bindingHandlers.navScroller = {
        laxityInterval: 40,
        init: function (element)
        {
            var rollUp = jquery('.roll-up', element);
            var rollDown = jquery('.roll-down', element);
            var navWrap = jquery('.nav-wrapper', element);
            var hammerMgr = null;
            var scrollUp = function (evtStub, scrollOnPx)
            {
                var scrollOn = navWrap.scrollTop() - (scrollOnPx || navWrap.height());
                if (scrollOn < ko.bindingHandlers.navScroller.laxityInterval)
                {
                    scrollOn = 0;
                }

                navWrap.stop(true, true).animate({ scrollTop: scrollOn },
                ETR.UISettings.ElementVisibilityInterval,
                    checkArrowsVisibility);
            };
            var scrollDown = function (evtStub, scrollOnPx)
            {
                var scrollOn = navWrap.scrollTop() + (scrollOnPx || navWrap.height());
                if (navWrap.prop('scrollHeight') - scrollOn - navWrap.height() < ko.bindingHandlers.navScroller.laxityInterval)
                {
                    scrollOn = navWrap.prop('scrollHeight');
                }
                navWrap.stop(true, true).animate({ scrollTop: scrollOn },
                    ETR.UISettings.ElementVisibilityInterval,
                    checkArrowsVisibility);
            };
            var wheelHandler = function (evt)
            {
                evt.preventDefault();
                if (evt.deltaY > 0)
                {
                    scrollUp(null, (evt.deltaY * evt.deltaFactor) > 100 ? (evt.deltaY * evt.deltaFactor) : 100);
                } else
                {
                    scrollDown(null, (-1 * evt.deltaY * evt.deltaFactor) > 100 ? (-1 * evt.deltaY * evt.deltaFactor) : 100);
                }
            };

            rollUp.on('click', scrollUp);
            rollDown.on('click', scrollDown);
            var checkArrowsVisibility = _.throttle(function ()
            {
                if (navWrap.scrollTop() === 0)
                {
                    rollUp.hide();
                } else if (navWrap.scrollTop() !== 0)
                {
                    rollUp.show();
                }
                if (navWrap.scrollTop() + navWrap.height() >= navWrap.prop('scrollHeight'))
                {
                    rollDown.hide();
                } else if (navWrap.scrollTop() + navWrap.height() < navWrap.prop('scrollHeight'))
                {
                    rollDown.show();
                }
            }, 200, { leading: false });

            jquery(window).on('resize', checkArrowsVisibility);
            jquery(element).mousewheel(wheelHandler);


            if (ETR.UISettings.SupportsTouch && window.Hammer)
            {
                hammerMgr = new window.Hammer(element);
                hammerMgr.get('swipe').set({ direction: window.Hammer.DIRECTION_ALL });
                hammerMgr.on('swipeup', scrollDown);
                hammerMgr.on('swipedown', scrollUp);
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (hammerMgr !== null)
                {
                    hammerMgr.destroy();
                }
                rollUp.off('click', scrollUp);
                rollDown.off('click', scrollDown);
                jquery(window).off('resize', checkArrowsVisibility);
                jquery(element).unmousewheel(wheelHandler);
                scrollUp = null;
                scrollDown = null;
                checkArrowsVisibility = null;
                rollUp = null;
                rollDown = null;
                wheelHandler = null;
                navWrap = null;
            });
        }
    };
});