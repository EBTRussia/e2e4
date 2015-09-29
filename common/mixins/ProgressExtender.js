define(['ko', 'underscore'], function (ko, _)
{
    'use strict';
    var progressExtender = {
        apply: function ()
        {
            this.progressStep = ko.observable(0);
            this.progressMessage = ko.observable(null);
            this.progressState = ko.observable(0);
            this.increaseProgress = function ()
            {
                var progress = this.progressState() + (100 / this.progressStep());
                progress = progress > 100 ? 100 : progress;
                this.progressState(progress);
            };
            this.stopProgress = function ()
            {
                setTimeout(_.bind(function ()
                {
                    this.progressState(0);
                    this.progressStep(0);
                    this.progressMessage(null);
                }, this), ETR.UISettings.MinimalUIDelayInterval);
            };
        },
        release: function ()
        {
            delete this.progressStep;
            delete this.progressMessage;
            delete this.progressState;
            delete this.increaseProgress;
            delete this.stopProgress;
        }
    };
    return progressExtender;
});