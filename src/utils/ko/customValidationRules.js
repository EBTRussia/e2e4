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
        ko.validation.registerExtenders();
    });