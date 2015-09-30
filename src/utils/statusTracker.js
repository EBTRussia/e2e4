define(['jquery', 'ko', 'underscore', 'StatusViewModel'], function (jquery, ko, _, statusViewModelDef)
{
    'use strict';
    var statusTracker = function ()
    {
        this.status = ko.observable(ETR.ProgressState.Done);
        this.modalDisplayed = ko.observable(false);
        this.statusList = ko.observableArray([]);

        this.statusDisplayed = ko.computed(function ()
        {
            return this.status() !== ETR.ProgressState.Done;
        }, this);

        this.isActive = ko.computed(function ()
        {

            return this.statusDisplayed() || this.modalDisplayed();
        }, this);

        this.trackStatus = function (title)
        {
            var sid = setTimeout(_.bind(function ()
            {
                this.status(ETR.ProgressState.Progress);
                if (title)
                {
                    var statusModel = new statusViewModelDef(ETR.ProgressState.Progress, title);
                    statusModel.sid = sid;
                    this.statusList.push(statusModel);
                }
            }, this), ETR.UISettings.ProgressDelayInterval);
            return sid;
        };

        this.resolveStatus = function (sid, status)
        {
            if (sid)
            {
                clearTimeout(sid);
                var current = ko.utils.arrayFirst(this.statusList(), function (item)
                {
                    return item.sid === sid;
                });
                if (current)
                {
                    current.status(status);
                }
            }
            setTimeout(_.bind(function ()
            {
                var undone = ko.utils.arrayFirst(this.statusList(), function (item)
                {
                    return item.status() === ETR.ProgressState.Progress;
                });

                if (undone === null)
                {
                    this.statusList.disposeAll();
                    this.status(ETR.ProgressState.Done);
                }
                else
                {
                    var currentStatuses = this.statusList.remove(function (item)
                    {
                        return item.sid === sid;
                    });
                    for (var i = 0; i < currentStatuses.length; i++)
                    {
                        currentStatuses[i].dispose();
                    }
                }
            }, this), ETR.UISettings.ElementVisibilityInterval);
        };

        this.displayStatusCallback = function (element)
        {
            if (element.nodeType === 1)
            {
                jquery(element).hide().slideDown(ETR.UISettings.ElementVisibilityInterval);
            }
        };
        this.hideStatusCallback = function (element)
        {
            if (element.nodeType === 1)
            {
                jquery(element).slideUp(ETR.UISettings.ElementVisibilityInterval, function ()
                {
                    jquery(element).remove();
                });
            }
        };
    };
    return new statusTracker();
});