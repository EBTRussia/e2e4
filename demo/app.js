window.ETR = window.ETR || {};

requirejs.config({
    baseUrl: '',
    map: {
        '*': {
            'knockout': 'ko'
        }
    },
    paths: {
        'text': 'libs/requirejs-text/text',
        'durandal': 'libs/durandal/js',
        'plugins': 'libs/durandal/js/plugins',
        'ko': 'libs/knockout.js/knockout',
        'jquery': 'libs/jquery/dist/jquery',
        'bootstrap': 'libs/bootstrap/dist/js/bootstrap',
    },
    shim: {
        'demo/shell': { deps: ['text!demo/shell.html'] },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});
require(['jquery', 'src/globalConfigurator'],
    function (jquery, globalConfigurator)
    {
        'use strict';
        globalConfigurator.init();
        require(['durandal/system', 'durandal/binder', 'durandal/app'], function (system, viewModelBinder, app)
        {
            //>>excludeStart("build", pragmas.build);
            system.debug(true);
            viewModelBinder.throwOnErrors = true;
            //>>excludeEnd("build");
            app.start().then(function ()
            {
                app.setRoot('demo/shell');
            });
        });
    });