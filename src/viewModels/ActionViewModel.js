define(['ko', 'underscore', 'jquery'], function (ko, _, jquery)
{
    'use strict';
    var actionViewModelDef = function (settings)
    {
        this.text = settings.text || ETR.EmptyString;
        this.title = settings.title || ETR.EmptyString;
        this.cls = settings.cls || ETR.EmptyString;
        this.action = settings.action || jquery.noop;
        this.active = settings.active || false;
    };
    _.extend(actionViewModelDef.prototype, {
        dispose: function ()
        {
            this.action = null;
            if (ko.isObservable(this.active) && this.active.dispose)
            {
                this.active.dispose();
            }
            if (ko.isObservable(this.title) && this.title.dispose)
            {
                this.title.dispose();
            }
            if (ko.isObservable(this.text) && this.text.dispose)
            {
                this.text.dispose();
            }
            if (ko.isObservable(this.cls) && this.cls.dispose)
            {
                this.cls.dispose();
            }
        }
    });
    return actionViewModelDef;
});