define(['moment', 'underscore'], function (moment, _)
{
    'use strict';
    var monthDef = function (date)
    {
        var innerDate = moment(date).withServerOffset();
        this.periodType = ETR.ReportingPeriodType.Month;
        this.startDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), 1));
        this.endDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), innerDate.daysInMonth()));
    };


    _.extend(monthDef.prototype, {
        prev: function ()
        {
            var m = moment(this.startDate);
            return new monthDef(new Date(Date.UTC(m.year(), m.month(), m.date() - 1)));
        },
        next: function ()
        {
            var m = moment(this.endDate);
            return new monthDef(new Date(Date.UTC(m.year(), m.month(), m.date() + 1)));
        },
        isLastPeriodInMonth: function ()
        {
            return true;
        },
        toRequest: function ()
        {
            return {
                startDate: this.startDate.toRequest(),
                endDate: this.endDate.toRequest(),
                periodType: this.periodType
            };
        },
        getTitle: function ()
        {
            return moment(this.startDate).format('MMMM YYYY');
        },
        getShortTitle: function ()
        {
            return moment(this.startDate).format('MMM YYYY');
        },
        equals: function (first, second)
        {
            if (arguments.length === 1)
            {
                second = this;
            }
            return first && second && first.periodType === second.periodType && first.startDate && second.startDate && first.endDate && second.endDate &&
                first.startDate.getTime() === second.startDate.getTime() && first.endDate.getTime() === second.endDate.getTime();
        }
    });
    return monthDef;
});