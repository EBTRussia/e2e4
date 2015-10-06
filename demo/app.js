window.ETR = window.ETR || {};

requirejs.config({
    baseUrl: '',
    config: {
        //Set the config for the i18n
        //module ID
        i18n: {
            locale: 'ru-ru'
        }
    },
    map: {
        '*': {
            'knockout': 'ko'
        }
    },
    paths: {
        text: 'libs/requirejs-text/text',
        durandal: 'libs/durandal/js',
        plugins: 'libs/durandal/js/plugins',

        ko: 'libs/knockout.js/knockout',
        jquery: 'libs/jquery/dist/jquery',
        bootstrap: 'libs/bootstrap/dist/js/bootstrap',
        numbro: 'libs/numbro/numbro',
        'numbro.ru': 'libs/numbro/languages/ru-RU',
        underscore: 'libs/underscore/underscore',
        i18n: 'libs/requirejs-i18n/i18n',


        numberFormatBinding: 'src/utils/ko/numberFormatBinding',
        WcfDispatcher: 'src/utils/WcfDispatcher',
        statusTracker: 'src/utils/statusTracker',
        StatusViewModel: 'src/viewModels/StatusViewModel',
        notificationService: 'src/utils/toastrNotificationService',
        toastr: 'libs/toastr/toastr'
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