define(['ko', 'jquery', 'jquery.inputmask'], function (ko, jquery)
{
    'use strict';
    ko.bindingHandlers.inputMask = {
        after: ['value'],
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var completeTarget = allBindingsAccessor.get('completeTarget');
            var valueTarget = allBindingsAccessor.get('value');
            var maskValue = ko.unwrap(valueAccessor());
            var valueSubscription = null;

            if (maskValue)
            {
                jquery(element).inputmask(maskValue);
            }
            if (completeTarget !== undefined)
            {
                if (maskValue)
                {
                    completeTarget(jquery(element).inputmask('isComplete'));
                }
                if (valueTarget !== undefined)
                {
                    valueSubscription = valueTarget.subscribe(function ()
                    {
                        if (jquery(element).inputmask('getmetadata') !== undefined)
                        {
                            completeTarget(jquery(element).inputmask('isComplete'));
                        }
                    });
                }
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (valueSubscription !== null)
                {
                    valueSubscription.dispose();
                }
                jquery(element).inputmask('remove');
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var newMask = ko.unwrap(valueAccessor());
            var oldMask = jquery(element).inputmask('getmetadata');
            var completeTarget = allBindingsAccessor.get('completeTarget');

            if (newMask === oldMask)
            {
                return;
            }

            jquery(element).inputmask('remove')
                .val(String.Empty)
                .trigger('change');
            if (newMask)
            {
                jquery(element).inputmask(newMask);
                if (completeTarget !== undefined)
                {
                    completeTarget(jquery(element).inputmask('isComplete'));
                }
            }
        }
    };
});