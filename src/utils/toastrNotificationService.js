define(['jquery', 'toastr'], function (jquery, toastr)
{
    'use strict';
    return {
        error: function ()
        {
            return toastr.error.apply(this, jquery.makeArray(arguments));
        },
        info: function ()
        {
            return toastr.info.apply(this, jquery.makeArray(arguments));
        },
        warning: function ()
        {
            return toastr.warning.apply(this, jquery.makeArray(arguments));
        },
        success: function ()
        {
            return toastr.success.apply(this, jquery.makeArray(arguments));
        }
    };
});
