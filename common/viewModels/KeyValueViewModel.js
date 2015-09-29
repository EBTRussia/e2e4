define([], function ()
{
    'use strict';
    var keyValueViewModelDef = function (model)
    {
        this.id = model.id;
        this.title = model.title || String.Empty;
    };
    return keyValueViewModelDef;
});