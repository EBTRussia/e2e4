define(['ko'], function (ko)
{
    'use strict';
    var selectedExtender = {
        apply: function (keyAccessor)
        {
            this.key = keyAccessor;
            this.selected = ko.observable(false).extend({ notify: 'always', rateLimit: 0 });
        },
        release: function ()
        {
            delete this.key;
            delete this.selected;
        }
    };
    return selectedExtender;
});