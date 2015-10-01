define(['plugins/router', 'bootstrap', 'jquery', 'ko', 'koValidation'],
    function (router, bootstrap, jquery, ko)
    {
        'use strict';
        return (function ()
        {
            var def = {};

            def.initKoValidation = function ()
            {
                ko.validation.rules.greaterThan = {
                    validator: function (val, than)
                    {
                        var stringTrimRegEx = /^\s+|\s+$/g, testVal;
                        testVal = val;

                        if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                        {
                            return val > than;
                        }

                        if (typeof (val) === 'string')
                        {
                            testVal = val.replace(stringTrimRegEx, '');
                        }

                        return (!isNaN(testVal) && parseFloat(testVal) > parseFloat(than));
                    },
                    message: 'The field must be greater than {0}.'
                };

                ko.validation.rules.greaterOrEqualThan = {
                    validator: function (val, than)
                    {
                        var stringTrimRegEx = /^\s+|\s+$/g,
                            testVal;
                        testVal = val;

                        if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                        {
                            return val >= than;
                        }

                        if (typeof (val) === 'string')
                        {
                            testVal = val.replace(stringTrimRegEx, '');
                        }
                        return (!isNaN(testVal) && parseFloat(testVal) >= parseFloat(than));
                    },
                    message: 'The field must be greater or equal than {0}.'
                };

                ko.validation.rules.lessThan = {
                    validator: function (val, than)
                    {
                        var stringTrimRegEx = /^\s+|\s+$/g,
                            testVal;
                        testVal = val;

                        if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                        {
                            return val < than;
                        }

                        if (typeof (val) === 'string')
                        {
                            testVal = val.replace(stringTrimRegEx, '');
                        }
                        return (!isNaN(testVal) && parseFloat(testVal) < parseFloat(than));
                    },
                    message: 'The field must be less than {0}.'
                };

                ko.validation.rules.lessOrEqualThan = {
                    validator: function (val, than)
                    {
                        var stringTrimRegEx = /^\s+|\s+$/g,
                            testVal;
                        testVal = val;
                        if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                        {
                            return val <= than;
                        }
                        if (typeof (val) === 'string')
                        {
                            testVal = val.replace(stringTrimRegEx, '');
                        }
                        return (!isNaN(testVal) && parseFloat(testVal) <= parseFloat(than));
                    },
                    message: 'The field must be less or equal than {0}.'
                };

                ko.validation.rules.nondefault = {
                    validator: function (val)
                    {
                        var stringTrimRegEx = /^\s+|\s+$/g,
                            testVal;
                        if (val === undefined || val === null || val === 0 || val === '')
                        {
                            return false;
                        }
                        testVal = val;
                        if (typeof (val) === 'string')
                        {
                            testVal = val.replace(stringTrimRegEx, '');
                        }
                        return ((testVal + '').length > 0);
                    },
                    message: 'This field is required.'
                };
                ko.validation.registerExtenders();
            };
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
            def.extendjQuery = function ()
            {
                jquery.newUUID = function ()
                {
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
                    {
                        var r = (d + Math.random() * 16) % 16 | 0;
                        d = Math.floor(d / 16);
                        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                    });
                    return uuid;
                };

                jquery.fn.mobileFix = function (options)
                {
                    var $parent = jquery(this);
                    jquery(document)
                    .on('focus', 'input,textarea,select', function ()
                    {
                        $parent.addClass(options.addClass);
                    })
                    .on('blur', 'input,textarea,select', function ()
                    {
                        $parent.removeClass(options.addClass);
                        setTimeout(function ()
                        {
                            jquery(document).scrollTop(jquery(document).scrollTop());
                        }, 1);
                    });
                    return this;
                };
                jquery.clearSelection = function ()
                {
                    try
                    {
                        if (window.getSelection)
                        {
                            window.getSelection().removeAllRanges();
                        } else if (document.selection)
                        {
                            document.selection.empty();
                        }
                    } catch (e)
                    {

                    }
                };
                jquery.except = function (fromObj, cleanObj)
                {
                    for (var indexer in cleanObj)
                    {
                        if (cleanObj.hasOwnProperty(indexer))
                        {
                            delete fromObj[indexer];
                        }
                    }
                };
                jquery.getQueryString = function (path)
                {
                    path = path || window.location.href;
                    var parts = path.match(/\?([^#]*)?$/);
                    return parts && parts[1] ? parts[1] : '';
                };

                jquery.getCleanHash = function (path)
                {
                    path = path || window.location.href;
                    var matches = path.match(/^[^#]*(#.+)$/);
                    var hash = matches ? matches[1] : '';
                    return hash ? hash.replace(/\?([^#]*)?$/, '') : '';
                };
                jquery.parseQueryString = function (path)
                {
                    return path ? jquery.deparam(path, true) : {};
                };
                jquery.deparam = function (params, coerce)
                {
                    var obj = {},
                        coerceTypes = { 'true': true, 'false': false, 'null': null };

                    // Iterate over all name=value pairs.
                    jquery.each(params.replace(/\+/g, ' ').split('&'), function (j, v)
                    {
                        var param = v.split('='),
                            key = decodeURIComponent(param[0]),
                            val,
                            cur = obj,
                            i = 0,

                            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
                            // into its component parts.
                            keys = key.split(']['),
                            keysLast = keys.length - 1;

                        // If the first keys part contains [ and the last ends with ], then []
                        // are correctly balanced.
                        if (/\[/.test(keys[0]) && /\]$/.test(keys[keysLast]))
                        {
                            // Remove the trailing ] from the last keys part.
                            keys[keysLast] = keys[keysLast].replace(/\]$/, '');

                            // Split first keys part into two parts on the [ and add them back onto
                            // the beginning of the keys array.
                            keys = keys.shift().split('[').concat(keys);

                            keysLast = keys.length - 1;
                        } else
                        {
                            // Basic 'foo' style key.
                            keysLast = 0;
                        }

                        // Are we dealing with a name=value pair, or just a name?
                        if (param.length === 2)
                        {
                            val = decodeURIComponent(param[1]);

                            // Coerce values.
                            if (coerce)
                            {
                                val = val && !isNaN(val) ? +val              // number
                                    : val === 'undefined' ? undefined         // undefined
                                    : coerceTypes[val] !== undefined ? coerceTypes[val] // true, false, null
                                    : val;                                                // string
                            }

                            if (keysLast)
                            {
                                // Complex key, build deep object structure based on a few rules:
                                // * The 'cur' pointer starts at the object top-level.
                                // * [] = array push (n is set to array length), [n] = array if n is 
                                //   numeric, otherwise object.
                                // * If at the last keys part, set the value.
                                // * For each keys part, if the current level is undefined create an
                                //   object or array based on the type of the next keys part.
                                // * Move the 'cur' pointer to the next level.
                                // * Rinse & repeat.
                                for (; i <= keysLast; i++)
                                {
                                    key = keys[i] === '' ? cur.length : keys[i];
                                    cur = cur[key] = i < keysLast ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
                                }

                            } else
                            {
                                // Simple key, even simpler rules, since only scalars and shallow
                                // arrays are allowed.

                                if (jquery.isArray(obj[key]))
                                {
                                    // val is already an array, so push on the next value.
                                    obj[key].push(val);

                                } else if (obj[key] !== undefined)
                                {
                                    // val isn't an array, but since a second value has been specified,
                                    // convert val into an array.
                                    obj[key] = [obj[key], val];

                                } else
                                {
                                    // val is a scalar.
                                    obj[key] = val;
                                }
                            }

                        } else if (key)
                        {
                            // No value was defined, so set something meaningful.
                            obj[key] = coerce ? undefined : '';
                        }
                    });

                    return obj;
                };
            };
            def.extendKnockout = function ()
            {
                ko.navigateSmoothly = function (href, params, leanParams)
                {
                    var emParams = jquery.parseQueryString(jquery.getQueryString(href));
                    if (params)
                    {
                        var paramsObj = {};
                        for (var indexer in params)
                        {
                            if (params.hasOwnProperty(indexer))
                            {
                                var val = ko.unwrap(params[indexer]);
                                if (val && val.toRequest)
                                {
                                    paramsObj[indexer] = val.toRequest();
                                } else
                                {
                                    paramsObj[indexer] = val;
                                }
                            }
                        }
                        emParams = jquery.extend(emParams, paramsObj);
                    }
                    if (leanParams)
                    {
                        var currentParams = jquery.parseQueryString(jquery.getQueryString(window.location.href));
                        emParams = jquery.extend(currentParams, emParams);
                    }
                    href = jquery.getCleanHash(href) + '?' + jquery.param(emParams);
                    window.location.href = href;

                };
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