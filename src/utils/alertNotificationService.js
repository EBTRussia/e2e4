define(['jquery'], function (jquery)
{
    'use strict';
    return {
        error: function ()
        {
            alert(jquery.makeArray(arguments));
        },
        info: function ()
        {
            alert(jquery.makeArray(arguments));
        },
        warning: function ()
        {
            alert(jquery.makeArray(arguments));
        },
        success: function ()
        {
            alert(jquery.makeArray(arguments));
        }
    };
});
