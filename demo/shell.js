define(['plugins/router', 'numberFormatBinding'],
    function (router)
    {
        'use strict';
        var shellDef = function ()
        {
            this.router = router;
        };
        return shellDef;
    });