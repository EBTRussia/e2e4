define(['ko', 'jquery'],
    function (ko)
    {
        'use strict';

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
            var clonedObject = jquery.extend(true, {}, { defaultValue: (options.defaultValue === undefined ? target() : options.defaultValue) });

            target.defaultValue = clonedObject.defaultValue;

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
    });