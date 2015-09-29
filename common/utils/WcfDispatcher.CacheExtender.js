define(['WcfDispatcher', 'moment', 'underscore', 'jquery'], function (wcfDispatcherDef, moment, _, jquery)
{
    'use strict';
    _.extend(wcfDispatcherDef.prototype,
    {
        wrapWithCache: function (fn, cacheKey, expirationPolicy)
        {
            return _.wrap(fn, function (initialFn)
            {
                var q = jquery.Deferred();
                var cacheResult = this.getCacheValue(cacheKey);
                if (cacheResult !== undefined)
                {
                    _.delay(function (scope)
                    {
                        q.resolveWith(scope, [cacheResult]);
                    }, 0, this.requestContext || this);

                } else
                {
                    return initialFn.apply(this, Array.prototype.slice.call(arguments, 1))
                    .done(_.bind(function (result)
                    {
                        this.setCacheValue(cacheKey, result, expirationPolicy());
                        q.resolveWith(this.requestContext || this, jquery.makeArray(arguments));
                    }, this))
                    .fail(_.bind(function ()
                    {
                        q.rejectWith(this.requestContext || this, jquery.makeArray(arguments));
                    }, this));
                }
                return q.promise();
            });
        },
        setCacheValue: function (key, value, expiresAt)
        {
            if (wcfDispatcherDef.cacheEnabled)
            {
                var cleanDate = moment(expiresAt);
                var data = { data: value };

                if (cleanDate.isValid())
                {
                    wcfDispatcherDef.objectCache[key] = { value: JSON.stringify(data), expiresAt: expiresAt };
                    return value;
                }
                throw '"expiresAt" is invalid date';
            }
            else
            {
                return value;
            }
        },
        getCacheValue: function (key)
        {
            if (wcfDispatcherDef.cacheEnabled)
            {
                var val = wcfDispatcherDef.objectCache[key];
                if (typeof val === 'undefined' || val === null)
                {
                    return undefined;
                }
                if (moment().isAfter(val.expiresAt))
                {
                    delete wcfDispatcherDef.objectCache[key];
                    return undefined;
                }
                return JSON.parse(val.value).data;
            } else
            {
                return undefined;
            }
        },
        removeCacheEntry: function (key)
        {
            delete wcfDispatcherDef.objectCache[key];
        }
    });
    wcfDispatcherDef.cacheEnabled = true;
    wcfDispatcherDef.objectCache = {};
    return wcfDispatcherDef;
});