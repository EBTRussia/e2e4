define(['plugins/router'],
    function (router)
    {
        'use strict';
        var shellDef = function ()
        {
            this.router = router;
        };
        return shellDef;
    });