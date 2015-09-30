define(['ko', 'jquery', 'select2Local'], function (ko, jquery)
{
    'use strict';
    ko.bindingHandlers.periodsList = {
        processData: function (value, data)
        {
            var selectedId = '';
            for (var i = 0; i < data.length; i++)
            {
                data[i].PERIODS_LIST_ID = i;
                if (value && data[i].equals(value))
                {
                    selectedId = i + '';
                }
            }
            return selectedId;
        },
        init: function (element, valueAccessor)
        {
            var settings = ko.unwrap(valueAccessor());
            var $element = jquery(element);
            var selectedId;

            var changeFn = function (evt)
            {
                settings.period(evt.added);
            };

            var formatter = function (item)
            {
                if (item.periodType === ETR.ReportingPeriodType.Month)
                {
                    return '<span class="month">' + (ko.unwrap(settings.shortTitle) ? item.getShortTitle() : item.getTitle()) + '</span>';
                }

                if (item.periodType === ETR.ReportingPeriodType.Decade)
                {
                    return '<span class="decade">' + (ko.unwrap(settings.shortTitle) ? item.getShortTitle() : item.getTitle()) + '</span>';
                }
                return '';
            };

            var opts = {
                minimumResultsForSearch: -1,
                data: ko.unwrap(settings.periods),
                id: function (item) { return item.PERIODS_LIST_ID; },
                formatSelection: formatter,
                formatResult: formatter,
                width: 'resolve'
            };
            selectedId = ko.bindingHandlers.periodsList.processData(ko.unwrap(settings.period), opts.data);

            var listSubscription = null;
            var valSubscription = null;

            if (ko.isObservable(settings.periods))
            {
                listSubscription = settings.periods.subscribe(function (newValue)
                {
                    $element.select2('destroy');
                    opts.data = newValue;
                    selectedId = ko.bindingHandlers.periodsList.processData(ko.unwrap(settings.period), opts.data);
                    $element.select2(opts);
                    $element.select2('val', selectedId);
                    $element.select2('enable', opts.data.length > 0);
                });
            }

            $element.select2(opts).select2('enable', opts.data.length > 0);
            $element.select2('val', selectedId);

            if (ko.isObservable(settings.period))
            {
                $element.change(changeFn);
                valSubscription = settings.period.subscribe(function (newValue)
                {
                    for (var i = 0; i < opts.data.length; i++)
                    {
                        if (newValue && opts.data[i].equals(newValue))
                        {
                            $element.select2('val', i);
                            return;
                        }
                    }
                    $element.select2('val', '');
                });
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (listSubscription)
                {
                    listSubscription.dispose();
                }
                if (valSubscription)
                {
                    valSubscription.dispose();
                }

                $element.select2('destroy');
                $element.unbind('change', changeFn);
                $element = null;

                for (var i = 0; i < opts.data.length; i++)
                {
                    delete opts.data[i].PERIODS_LIST_ID;
                }
                opts = null;
                changeFn = null;
                settings = null;
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
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