define(['plugins/router', 'bootstrap', 'jquery', 'ko'],
    function (router, bootstrap, jquery, ko)
    {
        'use strict';
        return (function ()
        {
            var def = {};

            def.createEnumerations = function ()
            {
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
            };
            def.createTypeExtensions = function ()
            {
                Object.inherit = function (subClass, superClass)
                {
                    var f = function () { };
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
            };
            def.initUISettings = function ()
            {
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
                    'OAnimation': 'oanimationend',  // oTransitionEnd in very old Opera
                    'MozAnimation': 'animationend',
                    'WebkitAnimation': 'webkitAnimationEnd',
                    'webkitAnimation': 'webkitAnimationEnd'
                };

                ETR.UISettings.HasAnimations = false;
                if (typeof style[animationProp] === 'string')
                {
                    ETR.UISettings.HasAnimations = true;
                    ETR.UISettings.AnimationEndEventName = animationEvents[animationProp];
                }
                else
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
            };
            def.extendKnockout = function ()
            {
                ko.extenders.timer = function (target, interval)
                {
                    setInterval(function ()
                    {
                        target(new Date());
                    }, interval);
                    return target;
                };

                ko.extenders.filter = function (target, options)
                {
                    options.owner.filter = options.owner.filter || {};
                    options.owner.filter[options.fieldName] = target;
                    target.defaultValue = options.defaultValue === undefined ? target() : options.defaultValue;
                    target.ignoreOnAutoMap = (!!options.ignoreOnAutoMap) || false;
                    target.formatter = options.formatter || undefined;
                    target.emptyIsNull = options.emptyIsNull || false;
                    return target;
                };
                ko.extenders.numeric = function (target, precision)
                {
                    //create a writable computed observable to intercept writes to our observable
                    var result = ko.computed({

                        read: target,  //always return the original observables value
                        write: function (newValue)
                        {
                            var normalizedNewValue = (newValue + '').replace(/\s/g, '').replace(/,/g, '.');
                            if (normalizedNewValue.length === 0)
                            {
                                target(0);
                                return;
                            }

                            if (normalizedNewValue.lastIndexOf('.') === normalizedNewValue.length - 1 || normalizedNewValue === '-')
                            {
                                return;
                            }

                            var current = target();
                            var roundingMultiplier = Math.pow(10, precision);
                            var newValueAsNum = isNaN(normalizedNewValue) ? 0 : parseFloat(+normalizedNewValue);
                            var valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

                            //only write if it changed
                            if (valueToWrite !== current)
                            {
                                target(valueToWrite);
                            } else
                            {
                                //if the rounded value is the same, but a different value was written, force a notification for the current field
                                if (newValue * 1 !== current)
                                {
                                    target.notifySubscribers(valueToWrite);
                                }
                            }
                        }
                    }).extend({ notify: 'always' });

                    //initialize with current value to make sure it is rounded appropriately
                    result(target());

                    //return the new computed observable
                    return result;
                };

                ko.observableArray.fn.initWith = function (data, targetCtor, p1, p2, p3, p4, p5)
                {
                    var temp = this() || [];
                    for (var i = 0; i < data.length; i++)
                    {
                        temp.push(new targetCtor(data[i], p1, p2, p3, p4, p5));
                    }
                    this(temp);
                };
                ko.observableArray.fn.disposeAll = function (async)
                {
                    async = async === undefined ? true : !!async;
                    var items = this.removeAll();
                    if (async)
                    {
                        setTimeout(function ()
                        {

                            ko.utils.arrayForEach(items, function (item)
                            {
                                if (item.dispose)
                                {
                                    item.dispose();
                                }
                            });
                            items = null;
                        }, 0);

                    } else
                    {
                        ko.utils.arrayForEach(items, function (item)
                        {
                            if (item.dispose)
                            {
                                item.dispose();
                            }
                        });
                    }

                };
            };
            def.init = function ()
            {
                for (var m in def)
                {
                    if (def.hasOwnProperty(m))
                    {
                        if (m !== 'init' && jquery.isFunction(def[m]))
                        {
                            def[m]();
                        }
                    }
                }
            };
            return def;
        })();
    });