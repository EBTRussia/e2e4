define([], function ()
{
    'use strict';
    var ctor = function () { };
    ctor.prototype.activate = function (settings)
    {
        this.uploadSettings = settings.uploadSettings || {};
        this.uploadCallbacks = settings.uploadCallbacks || {};
        this.uploadUrl = settings.uploadUrl || String.Empty;
    };
    ctor.prototype.detached = function ()
    {
        this.uploadSettings = null;
        this.uploadCallbacks = null;
        this.uploadUrl = null;
    };
    return ctor;
});