define(['jquery', 'underscore', 'BaseViewModel', 'plugins/router', 'jQueryExtender'], function (jquery, _, baseViewModelDef, router)
{
    'use strict';
    var editViewModelDef = function (title, paramsToExclude)
    {
        this.paramsToExclude = paramsToExclude;
        editViewModelDef.superclass.constructor.call(this, title);
        this.baseInit = _.wrap(this.baseInit, function (baseInit, params)
        {
            baseInit.call(this);
            if (params && params.referrer)
            {
                this.referrer = params.referrer;
            }
        });

    };
    _.extend(ETR.setSuperclass(editViewModelDef, baseViewModelDef).prototype, {
        navToAppropriateView: function ()
        {
            //if we had multiple history items - navigating by history
            if (ETR.UISettings.historyLength > 1 || window.history.length > 3)
            {
                router.navigateBack();
                return;
            }
                //else try parse referrer and go to it
            else if (this.referrer)
            {
                var currentParams = jquery.parseQueryString(jquery.getQueryString());
                if (this.paramsToExclude && this.paramsToExclude.length)
                {
                    for (var i = 0; i < this.paramsToExclude.length; i++)
                    {
                        delete currentParams[this.paramsToExclude[i] + String.Empty];
                    }
                }
                delete currentParams.referrer;
                router.navigate(this.referrer + '?' + jquery.param(currentParams));
            }
                //else navigating to default route
            else
            {
                router.navigate(String.Empty);
            }
        }
    });
    return editViewModelDef;
});