define(['ko', 'jquery', 'moment'], function (ko, jquery, moment)
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
});