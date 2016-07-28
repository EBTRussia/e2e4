define(['ko', 'koValidation'],
    function (ko)
    {
        'use strict';
        ko.validation.rules.greaterThan = {
            validator: function (val, than)
            {
                var stringTrimRegEx = /^\s+|\s+$/g, testVal;
                testVal = val;

                if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                {
                    return val > than;
                }

                if (typeof (val) === 'string')
                {
                    testVal = val.replace(stringTrimRegEx, '');
                }

                return (!isNaN(testVal) && parseFloat(testVal) > parseFloat(than));
            },
            message: 'The field must be greater than {0}.'
        };

        ko.validation.rules.greaterOrEqualThan = {
            validator: function (val, than)
            {
                var stringTrimRegEx = /^\s+|\s+$/g,
                    testVal;
                testVal = val;

                if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                {
                    return val >= than;
                }

                if (typeof (val) === 'string')
                {
                    testVal = val.replace(stringTrimRegEx, '');
                }
                return (!isNaN(testVal) && parseFloat(testVal) >= parseFloat(than));
            },
            message: 'The field must be greater or equal than {0}.'
        };

        ko.validation.rules.lessThan = {
            validator: function (val, than)
            {
                var stringTrimRegEx = /^\s+|\s+$/g,
                    testVal;
                testVal = val;

                if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                {
                    return val < than;
                }

                if (typeof (val) === 'string')
                {
                    testVal = val.replace(stringTrimRegEx, '');
                }
                return (!isNaN(testVal) && parseFloat(testVal) < parseFloat(than));
            },
            message: 'The field must be less than {0}.'
        };

        ko.validation.rules.lessOrEqualThan = {
            validator: function (val, than)
            {
                var stringTrimRegEx = /^\s+|\s+$/g,
                    testVal;
                testVal = val;
                if ((val instanceof Date && !isNaN(val.valueOf())) && (than instanceof Date && !isNaN(than.valueOf())))
                {
                    return val <= than;
                }
                if (typeof (val) === 'string')
                {
                    testVal = val.replace(stringTrimRegEx, '');
                }
                return (!isNaN(testVal) && parseFloat(testVal) <= parseFloat(than));
            },
            message: 'The field must be less or equal than {0}.'
        };

        ko.validation.rules.nondefault = {
            validator: function (val)
            {
                var stringTrimRegEx = /^\s+|\s+$/g,
                    testVal;
                if (val === undefined || val === null || val === 0 || val === '')
                {
                    return false;
                }
                testVal = val;
                if (typeof (val) === 'string')
                {
                    testVal = val.replace(stringTrimRegEx, '');
                }
                return ((testVal + '').length > 0);
            },
            message: 'This field is required.'
        };
        
        ko.validation.rules['minLength'] = {
            validator: function (val, minLength) {
                if(ko.validation.utils.isEmptyVal(val)) { return true; }
                var minLengthUW = ko.unwrap(minLength);
                var normalizedVal = ko.validation.utils.isNumber(val) ? ('' + val) : val;
                return normalizedVal.length >= minLengthUW;
            },
            message: 'Please enter at least {0} characters.'
        };

        ko.validation.rules['minLengthOrMaxLength'] = {
            validator: function (val, length) {
                if(ko.validation.utils.isEmptyVal(val)) { return true; }
                var lengthUW = ko.unwrap(length);
                var normalizedVal = ko.validation.utils.isNumber(val) ? ('' + val) : val;
                return (normalizedVal.length == lengthUW[0] || normalizedVal.length == lengthUW[1]);
            },
            message: 'Please enter at least {0} characters.'
        };
        
        ko.validation.formatMessage = function (message, params, observable) {
            if (ko.validation.utils.isObject(params) && params.typeAttr) {
                params = params.value;
            }
            if (ko.isObservable(message)) {
                message = ko.unwrap(message);
            }
            if (typeof message === 'function') {
                return message(params, observable);
            }
            var replacements = ko.unwrap(params);
            if (replacements == null) {
                replacements = [];
            }
            if (!ko.validation.utils.isArray(replacements)) {
                replacements = [replacements];
            }
            return message.replace(/{(\d+)}/gi, function(match, index) {
                if (typeof replacements[index] !== 'undefined') {
                    return replacements[index];
                }
                return match;
            });
        };
    
        ko.validation.registerExtenders();
    });