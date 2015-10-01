define(['ko', 'jquery', 'moment', 'numeral'], function (ko, jquery, moment, numeral)
{
    'use strict';
    ko.bindingHandlers.dateFormat = {
        after: ['value', 'text'],
        update: function (element, valueAccessor, allBindings)
        {
            var format = ko.unwrap(valueAccessor()) || 'L';
            var value;
            var text;
            var d;
            if (allBindings.get('value'))
            {

                value = ko.unwrap(allBindings.get('value'));
                if (value)
                {
                    d = moment(value);
                    text = d.isValid() ? d.format(format) : value;
                } else
                {
                    text = '';
                }
                jquery(element).val(text);
            }
            if (allBindings.get('text'))
            {
                value = ko.unwrap(allBindings.get('text'));
                if (value)
                {
                    d = moment(value);
                    text = d.isValid() ? d.format(format) : value;
                } else
                {
                    text = '';
                }
                jquery(element).text(text);
            }
        }
    };
    ko.bindingHandlers.numberFormat = {
        after: ['value', 'text'],
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var formatFn = function (val, zeroesCount)
            {
                var txt = '';
                if (val !== null && val !== undefined && !isNaN(val))
                {
                    txt = numeral(val).format(format);
                    if (zeroesCount > 0 && txt.length < zeroesCount)
                    {
                        var signValue = txt.charAt(0) === '-' ? '-' : '';
                        var zeroes = String.Empty;
                        txt = txt.replace('-', '');
                        while (signValue.length + txt.length + zeroes.length < zeroesCount)
                        {
                            zeroes = '0' + zeroes;
                        }
                        txt = signValue + zeroes + txt.replace('-', '');
                    }
                }
                return txt;
            };


            var format = ko.unwrap(valueAccessor()) || '0,0[.]00';
            var leadZerosCount = ko.unwrap(allBindingsAccessor.get('withLeadZeros')) || 0;
            var value;
            var text;
            if (allBindingsAccessor.get('value'))
            {
                value = ko.unwrap(allBindingsAccessor.get('value'));
                text = formatFn(value, leadZerosCount);
                jquery(element).val(text);
            }
            if (allBindingsAccessor.get('text'))
            {
                value = ko.unwrap(allBindingsAccessor.get('text'));
                text = formatFn(value, leadZerosCount);
                jquery(element).text(text);
            }
        }
    };

    ko.bindingHandlers.booleanText = {
        update: function (element, valueAccessor)
        {
            var val = ko.unwrap(valueAccessor());
            var text = '';
            if (val === true)
            {
                text = ETR.LocalResources.CommonUserMessageYes;
            }
            else if (val === false)
            {
                text = ETR.LocalResources.CommonUserMessageNo;
            }
            jquery(element).text(text);
        }
    };
    ko.bindingHandlers.booleanIcon = {
        update: function (element, valueAccessor)
        {
            var val = ko.unwrap(valueAccessor());
            if (val === true)
            {
                jquery(element).removeClass('icon-false').addClass('icon-true');
            } else if (val === false)
            {
                jquery(element).removeClass('icon-true').addClass('icon-false');
            } else
            {
                jquery(element).removeClass('icon-true icon-false');
            }
        }
    };
    ko.bindingHandlers.localizedText = {
        update: function (element, valueAccessor)
        {
            var value = ko.unwrap(valueAccessor());
            if (value !== null)
            {
                jquery(element).text(ko.resourceManager[value]);
            }
        }
    };
    ko.bindingHandlers.localizedValue = {
        update: function (element, valueAccessor)
        {
            var value = ko.unwrap(valueAccessor());
            if (value !== null)
            {
                jquery(element).val(ko.resourceManager[value]);
            }
        }
    };
    ko.bindingHandlers.localizedAttr = {
        update: function (element, valueAccessor)
        {
            var value = ko.unwrap(valueAccessor());
            if (value !== null)
            {
                var $el = jquery(element);
                for (var attrName in value)
                {
                    $el.attr(attrName, ko.resourceManager[value[attrName]]);
                }
            }
        }
    };
    ko.bindingHandlers.localizedHtml = {
        update: function (element, valueAccessor)
        {
            var value = ko.unwrap(valueAccessor());
            if (value !== null)
            {
                jquery(element).html(ko.resourceManager[value]);
            }
        }
    };
});