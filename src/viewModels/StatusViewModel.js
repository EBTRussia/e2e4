define(['ko'], function (ko)
{
    'use strict';
    var statusViewModelDef = function (status, title)
    {
        this.status = ko.observable(status);
        this.title = ko.observable(title);
        this.className = ko.computed(function ()
        {
            switch (this.status())
            {
                case ETR.ProgressState.Done:
                    return 'status status-resolved';
                case ETR.ProgressState.Progress:
                    return 'status status-progress';
                case ETR.ProgressState.Fail:
                    return 'status status-fail';
                default:
                    return ETR.EmptyString;
            }
        }, this);

        this.dispose = function ()
        {
            this.className.dispose();
        };
    };
    return statusViewModelDef;
});