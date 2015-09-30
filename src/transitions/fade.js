define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $)
{
    'use strict';
    var fadeOutDuration = 100;
    var endValues = {
        opacity: 1
    };
    var clearValues = {
        opacity: ''
    };

    var isIE = navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/MSIE/);

    var animation = false,
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        elm = document.createElement('div');

    if (elm.style.animationName !== undefined)
    {
        animation = true;
    }

    if (!animation)
    {
        for (var i = 0; i < domPrefixes.length; i++)
        {
            if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined)
            {
                animation = true;
                break;
            }
        }
    }
    if (animation)
    {
        if (isIE)
        {
            system.log('Using CSS3/jQuery mixed animations.');
        } else
        {
            system.log('Using CSS3 animations.');
        }
    } else
    {
        system.log('Using jQuery animations.');
    }

    function removeAnimationClasses(ele)
    {
        ele.classList.remove('fade-in');
        ele.classList.remove('fade-out');
    }

    var entrance = function (context)
    {
        return system.defer(function (dfd)
        {
            function endTransition()
            {
                dfd.resolve();
            }

            function scrollIfNeeded()
            {
                if (!context.keepScrollPosition)
                {
                    $(document).scrollTop(0);
                }
            }

            if (!context.child)
            {
                $(context.activeView).fadeOut(fadeOutDuration, endTransition);
            } else
            {
                var duration = context.duration || 400;
                var $child = $(context.child);

                var startValues = {
                    opacity: 0
                };

                var startTransition = function ()
                {
                    scrollIfNeeded();
                    context.triggerAttach();
                    if (animation)
                    {
                        removeAnimationClasses(context.child);
                        context.child.classList.add('fade-in');
                        setTimeout(function ()
                        {
                            removeAnimationClasses(context.child);
                            if (context.activeView)
                            {
                                removeAnimationClasses(context.activeView);
                            }
                            $child.css(clearValues);
                            endTransition();
                        }, duration);
                    } else
                    {
                        $child.animate(endValues, {
                            duration: duration,
                            easing: 'swing',
                            always: function ()
                            {
                                $child.css(clearValues);
                                endTransition();
                            }
                        });
                    }
                };

                $child.css(startValues);

                if (context.activeView)
                {
                    if (animation && !isIE)
                    {
                        removeAnimationClasses(context.activeView);
                        context.activeView.classList.add('fade-out');
                        setTimeout(startTransition, fadeOutDuration);
                    } else
                    {
                        $(context.activeView).fadeOut({ duration: fadeOutDuration, always: startTransition });
                    }
                } else
                {
                    startTransition();
                }
            }
        }).promise();
    };
    return entrance;
});
