define(['ko', 'jquery'], function (ko, jquery)
{
    'use strict';
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