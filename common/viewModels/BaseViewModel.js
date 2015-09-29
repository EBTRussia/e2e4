define(['ko', 'underscore'], function (ko, _)
{
    'use strict';
    var baseViewModelDef = function (title)
    {
        this.disposed = false;
        this.inited = false;
        this.title = ko.observable(title || null);
        this.state = ko.observable(ETR.ProgressState.Initial);
        this.busy = ko.computed(function ()
        {
            return this.state() === ETR.ProgressState.Progress;
        }, this);

        this.ready = ko.computed(function ()
        {
            return this.state() !== ETR.ProgressState.Progress;
        }, this);
    };
    _.extend(baseViewModelDef.prototype,
    {
        nowDate: ko.observable(new Date()).extend({ timer: 10000 }),
        baseInit: function ()
        {
            this.inited = true;
        },
        baseDispose: function ()
        {
            this.ready.dispose();
            this.busy.dispose();
            this.disposed = true;
        }
    });
    return baseViewModelDef;
});