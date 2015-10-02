define(['ko', 'jquery', 'numbro'], function (ko, jquery, numbro)
{
    'use strict';
    ko.bindingHandlers.numberFormat = {
        after: ['value', 'text'],
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var formatFn = function (val, zeroesCount)
            {
                var txt = '';
                if (val !== null && val !== undefined && !isNaN(val))
                {
                    txt = numbro(val).format(format);
                    if (zeroesCount > 0 && txt.length < zeroesCount)
                    {
                        var signValue = txt.charAt(0) === '-' ? '-' : '';
                        var zeroes = ETR.EmptyString;
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
});