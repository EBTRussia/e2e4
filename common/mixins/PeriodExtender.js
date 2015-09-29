define(['ko', 'underscore', 'misc/BaseInfoService', 'ReportingPeriod'], function (ko, _, baseInfoServiceDef, reportingPeriod)
{
    'use strict';
    var periodExtender = {
        apply: function ()
        {
            this.baseInfoService = new baseInfoServiceDef(this);
            this.periods = ko.observableArray([]);
            this.period = ko.observable(null).extend(
            {
                filter: { fieldName: 'period', owner: this, ignoreOnAutoMap: true }
            });

            this.initPeriods = function (params)
            {
                if (params.period && params.period.periodType && params.period.startDate)
                {
                    this.period(reportingPeriod.createPeriod(params.period.periodType, params.period.startDate));
                }
                return this.baseInfoService.getAgencyPeriodsInfo()
                    .done(function (result)
                    {
                        this.periods(result.reportingPeriods);
                        if (this.periods().length > 1)
                        {
                            if (this.period() === null)
                            {
                                this.period(this.periods()[1]);
                            }
                            this.period.defaultValue = this.periods()[1];
                        }
                    });
            };
        },
        release: function ()
        {
            this.baseInfoService.dispose();
            this.periods.removeAll();
            this.period.defaultValue = null;
            this.period(null);
        }
    };
    return periodExtender;
});