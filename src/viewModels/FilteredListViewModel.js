define(['jquery', 'underscore', 'ko', 'ListViewModel', 'ModelWithFilterExtender'], function (jquery, _, ko, listViewModelDef, modelWithFilterExtender)
{
    'use strict';
    var filteredListViewModelDef = function (title)
    {
        filteredListViewModelDef.superclass.constructor.call(this, title);
        modelWithFilterExtender.apply.call(this);

        this.baseDispose = _.wrap(this.baseDispose, function (baseDispose)
        {
            modelWithFilterExtender.release.call(this);
            baseDispose.call(this);
        });
        this.toRequest = _.wrap(this.toRequest, function (baseToRequest)
        {
            var result = baseToRequest.call(this);
            this.apllyFilterParams(result);
            return result;
        });

        this.resetSettings = _.wrap(this.resetSettings, function (baseReset)
        {
            baseReset.call(this);
            this.resetFilterToDefault();
        });
    };
    ETR.setSuperclass(filteredListViewModelDef, listViewModelDef);
    return filteredListViewModelDef;
});