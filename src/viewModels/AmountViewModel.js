define(['underscore', 'ko', 'numeral'], function (_, ko, numeral)
{
    'use strict';
    var amountViewModelDef = function (model)
    {
        this.amount = ko.observable(model.amount);
        this.currency = ko.observable(model.currency);
        this.toString = ko.computed(function ()
        {
            return String.format('{0} {1}', numeral(this.amount()).format('0,0[.]00'), this.currency());
        }, this);

    };
    _.extend(amountViewModelDef.prototype, {
        dispose: function ()
        {
            this.toString.dispose();
        },
        toRequest: function ()
        {
            return { amount: this.amount(), currency: this.currency() };
        }
    });
    return amountViewModelDef;
});