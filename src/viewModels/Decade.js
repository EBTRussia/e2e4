define(['moment', 'underscore', 'etrLocales'], function (moment, _)
{
    'use strict';
    var decadeDef = function (date)
    {
        var innerDate = moment(date).withServerOffset();
        this.periodType = ETR.ReportingPeriodType.Decade;

        if (innerDate.date() <= 10)
        {
            this.startDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), 1));
            this.endDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), 10));
        } else if (innerDate.date() <= 20)
        {
            this.startDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), 11));
            this.endDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), 20));
        } else
        {
            this.startDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), 21));
            this.endDate = new Date(Date.UTC(innerDate.year(), innerDate.month(), innerDate.daysInMonth()));
        }
    };


    _.extend(decadeDef.prototype, {
        shortTitleTemplate: '{0} {1}',
        titleTemplate: '{0} {1} {2}',
        prev: function ()
        {
            var m = moment(this.startDate);
            return new decadeDef(new Date(Date.UTC(m.year(), m.month(), m.date() - 1)));
        },
        next: function ()
        {
            var m = moment(this.endDate);
            return new decadeDef(new Date(Date.UTC(m.year(), m.month(), m.date() + 1)));
        },
        isLastPeriodInMonth: function ()
        {
            var m = moment(this.endDate);
            return m.date() === m.daysInMonth();
        },
        getTitle: function (caseType)
        {
            var decadeName = String.Empty;
            var m = moment(this.startDate);

            switch (m.date())
            {
                case 1:
                    decadeName = caseType === ETR.CaseType.Genitive ? decadeDef.DecadeNameGenitiveFirst : decadeDef.DecadeNameNominativeFirst;
                    break;
                case 11:
                    decadeName = caseType === ETR.CaseType.Genitive ? decadeDef.DecadeNameGenitiveSecond : decadeDef.DecadeNameNominativeSecond;
                    break;
                case 21:
                    decadeName = caseType === ETR.CaseType.Genitive ? decadeDef.DecadeNameGenitiveThird : decadeDef.DecadeNameNominativeThird;
                    break;
            }
            return String.format(this.titleTemplate, decadeName, moment.months('Do MMMM', m.month()), m.year());
        },
        getShortTitle: function ()
        {
            var m = moment(this.startDate);
            var decadeNumber = null;
            switch (m.date())
            {
                case 1:
                    decadeNumber=1;
                    break;
                case 11:
                    decadeNumber = 2;
                    break;
                case 21:
                    decadeNumber = 3;
                    break;
            }

            return String.format(this.shortTitleTemplate, decadeNumber, m.format('MMM YY'));
        },
        equals: function (first, second)
        {
            if (arguments.length === 1)
            {
                second = this;
            }
            return first && second && first.periodType === second.periodType && first.startDate && second.startDate && first.endDate && second.endDate &&
                first.startDate.getTime() === second.startDate.getTime() && first.endDate.getTime() === second.endDate.getTime();
        },
        toRequest: function ()
        {
            return {
                startDate: this.startDate.toRequest(),
                endDate: this.endDate.toRequest(),
                periodType: this.periodType
            };
        }
    });

    decadeDef.DecadeNameGenitiveFirst = ETR.LocalResources.CommonDecadeNameGenitiveFirst;
    decadeDef.DecadeNameNominativeFirst = ETR.LocalResources.CommonDecadeNameNominativeFirst;
    decadeDef.DecadeNameGenitiveSecond = ETR.LocalResources.CommonDecadeNameGenitiveSecond;
    decadeDef.DecadeNameNominativeSecond = ETR.LocalResources.CommonDecadeNameNominativeSecond;
    decadeDef.DecadeNameGenitiveThird = ETR.LocalResources.CommonDecadeNameGenitiveThird;
    decadeDef.DecadeNameNominativeThird = ETR.LocalResources.CommonDecadeNameNominativeThird;
    return decadeDef;
});