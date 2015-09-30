define(['Decade', 'Month', 'CurrencyPeriod'], function (decadeDef, monthDef, currencyPeriodDef)
{
    'use strict';
    var periodDef = {
        empty: function ()
        {
            return {
                startDate: null,
                endDate: null,
                periodType: null,
                getTitle: function ()
                {
                    return String.Empty;
                },
                equals: function (other)
                {
                    return !other || (!other.periodType && !other.startDate && !other.endDate);
                },
                toRequest: function ()
                {
                    return null;
                }
            };
        },
        createPeriod: function (periodType, from, to, currencyCode)
        {
            if (currencyCode)
            {
                return new currencyPeriodDef(from, to, currencyCode, periodType);
            }
            switch (periodType)
            {
                case ETR.ReportingPeriodType.Decade:
                    return new decadeDef(from);
                case ETR.ReportingPeriodType.Month:
                    return new monthDef(from);
                default:
                    return null;
            }
        }
    };
    return periodDef;
});