define(['ko', 'underscore', 'jquery'], function (ko, _, jquery)
{
    'use strict';
    var modelWithFilterExtender = {
        apply: function ()
        {
            this.filter = this.filter || {};
            this.baseInit = _.wrap(this.baseInit, function (baseInit, params)
            {
                baseInit.call(this, params);
                for (var index in this.filter)
                {
                    if (params && params[index] !== undefined && false === this.filter[index].ignoreOnAutoMap)
                    {
                        var propsedVal = this.filter[index].emptyIsNull ? params[index] || null : params[index];

                        if (ko.isObservable(this.filter[index]))
                        {
                            this.filter[index](propsedVal);
                        } else
                        {
                            this.filter[index] = propsedVal;
                        }
                    }
                }
            });

            this.apllyFilterParams = function (data)
            {
                for (var indexer in this.filter)
                {
                    var formatter = this.filter[indexer].formatter;
                    var val = ko.unwrap(this.filter[indexer]);

                    if (val && val.toRequest)
                    {
                        data[indexer] = formatter ? formatter.call(this, val.toRequest()) : val.toRequest();
                    } else
                    {
                        data[indexer] = formatter ? formatter.call(this, val) : (this.filter[indexer].emptyIsNull ? val || null : val);
                    }
                }
                return data;
            };
            this.resetFilterToDefault = function ()
            {
                for (var indexer in this.filter)
                {
                    var clonedObject = jquery.extend(true, {}, { defaultValue: this.filter[indexer].defaultValue });
                    this.filter[indexer](clonedObject.defaultValue);
                }
            };
        },
        release: function ()
        {
            for (var index in this.filter)
            {
                delete this.filter[index].formatter;
                delete this.filter[index].defaultValue;
                delete this.filter[index].ignoreOnAutoMap;
                delete this.filter[index].formatter;
                delete this.filter[index].emptyIsNull;
            }
        }
    };

    return modelWithFilterExtender;
});