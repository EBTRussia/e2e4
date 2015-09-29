define(['ko', 'jquery', 'bootstrap-switch'], function (ko, jquery)
{
    'use strict';
    ko.bindingHandlers.bsswitch = {
        after: ['checked'],
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var settings = jquery.extend({}, ko.unwrap(valueAccessor()));

            if (settings.localize === true)
            {
                settings.onText = ko.resourceManager[settings.onText];
                settings.offText = ko.resourceManager[settings.offText];
            }
            delete settings.localize;
            var $el = jquery(element);
            $el.bootstrapSwitch(settings);

            var checked = allBindingsAccessor.get('checked');
            var subscription = null;
            var checkedHandler = function (evt, newVal)
            {
                checked(newVal);
            };
            var vmSubscriptionHandler = function (newVal)
            {
                $el.bootstrapSwitch('state', newVal);
            };
            if (checked && ko.isObservable(checked))
            {
                $el.on('switchChange.bootstrapSwitch', checkedHandler);
                subscription = checked.subscribe(vmSubscriptionHandler);
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (subscription !== null)
                {
                    subscription.dispose();
                }
                $el.off('switchChange.bootstrapSwitch', checkedHandler);
                $el.bootstrapSwitch('destroy');
                $el = null;
            });
        }
    };
});