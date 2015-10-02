define(['plugins/router'],
    function (router)
    {
        'use strict';
        return {
            init: function ()
            {
                ETR.setSuperclass = function (subClass, superClass)
                {
                    var f = function ()
                    {
                    };
                    f.prototype = superClass.prototype;
                    subClass.prototype = new f();

                    subClass.prototype.constructor = subClass;
                    subClass.superclass = superClass.prototype;

                    if (superClass.prototype.constructor === Object.prototype.constructor)
                    {
                        superClass.prototype.constructor = superClass;
                    }
                    return subClass;
                };
                String.Empty = '';
                String.format = function ()
                {
                    var s = arguments[0];
                    for (var i = 0; i < arguments.length - 1; i++)
                    {
                        var reg = new RegExp('\\{' + i + '\\}', 'gm');
                        s = s.replace(reg, arguments[i + 1]);
                    }
                    return s;
                };



                ETR.KeyCodes = {
                    Enter: 13,
                    Shift: 16,
                    Ctrl: 17,
                    Alt: 18,
                    Esc: 27,
                    ArrowUp: 38,
                    ArrowDown: 40
                };
                ETR.FaultLevel =
                {
                    None: 0,
                    Info: 1,
                    Warning: 2,
                    Error: 3
                };
                ETR.HttpStatusCode =
                {
                    OK: 200,
                    ImATeapot: 418,
                    BadRequest: 400,
                    Unauthorized: 401,
                    Forbidden: 403,
                    NotFound: 404,
                    Conflict: 409
                };

                ETR.HttpVerb =
                {
                    GET: 'GET',
                    POST: 'POST'
                };

                ETR.SortOrder = {
                    ASC: 0,
                    DESC: 1,
                    toggle: function (val)
                    {
                        return val === ETR.SortOrder.ASC ? ETR.SortOrder.DESC : ETR.SortOrder.ASC;
                    }
                };

                ETR.CaseType =
                {
                    Nominative: 1,
                    Genitive: 2,
                    Dative: 3,
                    Accusative: 4,
                    Ablative: 5,
                    Prepositional: 6
                };

                ETR.ReportingPeriodType =
                {
                    Unknown: 0,
                    Decade: 1,
                    Month: 2
                };

                ETR.ProgressState =
                {
                    Initial: 0,
                    Done: 1,
                    Progress: 2,
                    Fail: 3,
                    Cancelled: 4
                };

                ETR.ModelState =
                {
                    Initial: 0,
                    Valid: 1,
                    Invalid: 2,
                    Progress: 3,
                    Success: 4,
                    Fail: 5,
                    Locked: 6
                };


                ETR.UISettings = {
                    ProgressDelayInterval: 500,
                    MinimalUIDelayInterval: 1500,
                    ElementVisibilityInterval: 500,
                    ElementHoverVisibilityInterval: 200,
                    ElementHoverDelay: 400,
                    ScrollToTopMaxTiming: 800,
                    MaxQueryStringLength: 2000,
                    MainScrollAreaSelector: window,
                    historyLength: 0,
                    SmScreenResolution: 768
                };

                router.on('router:navigation:complete', function ()
                {
                    ETR.UISettings.historyLength++;
                });


                var style = (document.body || document.documentElement).style;
                var animationProp = 'animation';
                var animationEvents = {
                    'animation': 'animationend',
                    'OAnimation': 'oanimationend', // oTransitionEnd in very old Opera
                    'MozAnimation': 'animationend',
                    'WebkitAnimation': 'webkitAnimationEnd',
                    'webkitAnimation': 'webkitAnimationEnd'
                };

                ETR.UISettings.HasAnimations = false;
                if (typeof style[animationProp] === 'string')
                {
                    ETR.UISettings.HasAnimations = true;
                    ETR.UISettings.AnimationEndEventName = animationEvents[animationProp];
                } else
                {
                    // Tests for vendor specific prop
                    var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
                    animationProp = animationProp.charAt(0).toUpperCase() + animationProp.substr(1);
                    for (var i = 0; i < v.length; i++)
                    {
                        if (typeof style[v[i] + animationProp] === 'string')
                        {
                            ETR.UISettings.HasAnimations = true;
                            ETR.UISettings.AnimationEndEventName = animationEvents[v[i] + animationProp];
                            break;
                        }
                    }
                }
                ETR.UISettings.SupportsTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.msMaxTouchPoints;
            }
        };
    });