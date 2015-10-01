define(['ko', 'jquery', 'select2Local'], function (ko, jquery)
{
    'use strict';
    ko.bindingHandlers.select2 = {
        after: ['value'],
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var options = allBindingsAccessor.get('select2Options') || {};
            var validationSubscription = null;
            if (options.data && ko.isObservable(options.data))
            {
                options.data = ko.unwrap(options.data);
            }
            var $el = jquery(element);
            $el.select2(options);

            var dataBind = allBindingsAccessor.get('data');
            var changeTrigger;
            if (dataBind && ko.isObservable(dataBind))
            {
                changeTrigger = function ()
                {
                    dataBind($el.select2('data'));
                };
                $el.on('change', changeTrigger);
            }

            var valBind = allBindingsAccessor.get('value');
            if (ko.validation.utils.isValidatable(valBind))
            {
                validationSubscription = ko.computed(function ()
                {
                    if (ko.unwrap(valBind.isValid))
                    {
                        setTimeout(function ()
                        {
                            if ($el !== null)
                            {
                                $el.select2('container').removeClass(ko.validation.configuration.errorElementClass).attr('title', '');
                            }
                        }, 0);

                    } else
                    {
                        setTimeout(function ()
                        {
                            if ($el !== null)
                            {
                                $el.select2('container').addClass(ko.validation.configuration.errorElementClass).attr('title', $el.attr('title'));
                            }
                        }, 0);
                    }
                });
            }


            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (validationSubscription)
                {
                    validationSubscription.dispose();
                }
                if (changeTrigger)
                {
                    $el.off('change', changeTrigger);
                }
                $el.select2('destroy');
                $el = null;
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var options = allBindingsAccessor.get('select2Options') || {};
            var valBind = allBindingsAccessor.get('value');
            
            var $el = jquery(element);
            if (valueAccessor())
            {
                ko.bindingHandlers.options.update(element, valueAccessor, allBindingsAccessor);
                $el.select2('val', ko.unwrap(valBind));
            }
            else
            {
                if (valBind)
                {
                    if ($el.select2('val') !== ko.unwrap(valBind))
                    {
                        if (!options.multiple)
                        {
                            $el.select2('val', ko.unwrap(valBind));
                        }
                    }
                }
            }

            var enable = allBindingsAccessor.get('enable');
            if (enable !== undefined)
            {
                jquery(element).select2('enable', !!ko.unwrap(enable));
            }

            var disable = allBindingsAccessor.get('disable');
            if (disable !== undefined)
            {
                jquery(element).select2('enable', !ko.unwrap(disable));
            }
        }
    };
});