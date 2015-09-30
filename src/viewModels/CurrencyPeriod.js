define(['moment', 'underscore', 'Month', 'Decade'], function (moment, _, monthDef, decadeDef)
{
    'use strict';
    var currencyPeriodDef = function (startDate, endDate, currencyCode, periodType)
    {
        currencyPeriodDef.superclass.constructor.call(this, startDate);
        var innerDateStart = moment(startDate).withServerOffset();
        var innerDateEnd = moment(endDate).withServerOffset();
        this.periodType = periodType || ETR.ReportingPeriodType.Month;
        this.currencyCode = currencyCode;
        this.startDate = new Date(Date.UTC(innerDateStart.year(), innerDateStart.month(), innerDateStart.date()));
        this.endDate = new Date(Date.UTC(innerDateEnd.year(), innerDateEnd.month(), innerDateEnd.date()));


        this.toRequest = _.wrap(this.toRequest, function (baseToRequest)
        {
            var res = baseToRequest.call(this);
            res.currencyCode = this.currencyCode;
            return res;
        });

        this.equals = _.wrap(this.equals, function (baseEquals, first, second)
        {
            if (arguments.length === 2)
            {
                second = this;
            }
            var res = baseEquals.call(this, first, second);
            if (res === true)
            {
                return first.currencyCode && second.currencyCode && first.currencyCode === second.currencyCode;
            }
            return res;
        });
    };
    _.extend(Object.inherit(currencyPeriodDef, monthDef).prototype, {
        shortTitleTemplate: '{0}-{1} {2}',
        titleTemplate: '{0} - {1} {2} {3} ({4})',
        getTitle: function ()
        {
            var m = moment(this.startDate);
            return String.format(this.titleTemplate, m.format('DD'), moment(this.endDate).format('DD'), moment.months('Do MMMM', m.month()), m.year(), this.currencyCode);
        },
        getShortTitle: function () {
            
            var m = moment(this.startDate);
            var decade = new decadeDef(this.startDate);
            if (decade.equals(this))
            {
                return decade.getShortTitle();
            }
            return String.format(this.shortTitleTemplate, m.format('DD'), this.endDate.getDate(), m.format('MMM YY'));
        }
    });
    return currencyPeriodDef;
});