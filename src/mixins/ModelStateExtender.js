define(['jquery', 'ko', 'underscore', 'notificationService', 'koValidation'], function (jquery, ko, _, notificationService)
{
    'use strict';
    var modelStateExtender = {
        apply: function ()
        {
            var sid = null;
            var subscriptions = [];
            var validationObject = {};
            var trackerFn = function ()
            {
                if (validator)
                {
                    if (false === validator.isValid())
                    {
                        this.modelState(ETR.ModelState.Invalid);
                        this.stateMessage(validator.errors().join('; '));
                        return;
                    }
                }
                this.modelState(ETR.ModelState.Valid);
                this.stateMessage(null);
            };

            _.each(arguments, function (item, index)
            {
                if (ko.isObservable(item))
                {
                    subscriptions.push(item.subscribe(trackerFn, this));
                }
                validationObject[index] = item;
            }, this);

            var validator = ko.validatedObservable(validationObject);
            this.stateMessage = ko.observable(null);

            this._modelStateInternal = ko.observable(ETR.ModelState.Initial);

            this.isValid = _.bind(function ()
            {
                return validator.isValid();
            }, this);

            this.isDirty = ko.computed(function ()
            {
                return this._modelStateInternal() === ETR.ModelState.Valid || this._modelStateInternal() === ETR.ModelState.Invalid;
            }, this);

            this.resetState = _.bind(function ()
            {
                this._modelStateInternal(ETR.ModelState.Initial);
            }, this);

            this.stateCls = ko.computed(function ()
            {
                switch (this._modelStateInternal())
                {
                    case ETR.ModelState.Initial:
                        return 'icon-edit';
                    case ETR.ModelState.Valid:
                        return 'icon-save';
                    case ETR.ModelState.Invalid:
                        return 'icon-invalid';
                    case ETR.ModelState.Progress:
                        return 'icon-progress';
                    case ETR.ModelState.Success:
                        return 'icon-success';
                    case ETR.ModelState.Locked:
                        return 'icon-locked';
                    default:
                        return 'icon-edit';
                }
            }, this);
            this.isInProgress = ko.computed(function () { return this._modelStateInternal() === ETR.ModelState.Progress; }, this);
            this.modelState = ko.computed(
            {
                read: this._modelStateInternal,
                write: function (newValue)
                {
                    clearTimeout(sid);
                    if (newValue === ETR.ModelState.Success && this._modelStateInternal() !== ETR.ModelState.Success)
                    {
                        this._modelStateInternal(ETR.ModelState.Success);
                        sid = _.delay(this.resetState, 750);
                    }
                    this._modelStateInternal(newValue);
                },
                owner: this
            });
            this.displayValidationMessages = function ()
            {
                _.each(validator.errors(), function (error)
                {
                    notificationService.warning(error, null, { timeOut: 3500 });
                });
            };

            this.tryParseValidationResponse = function (errorResponse)
            {
                if (errorResponse.status === ETR.HttpStatusCode.BadRequest)
                {
                    try
                    {
                        var resultData = jquery.parseJSON(errorResponse.responseText);
                        if (resultData && resultData.faultMessage !== undefined && resultData.faultLevel !== undefined && resultData.faultDetails !== undefined && jquery.isArray(resultData.faultDetails))
                        {
                            var result = false;
                            _.each(resultData.faultDetails, function (item)
                            {
                                if (item.key !== null && item.key !== undefined && item.key !== ETR.EmptyString)
                                {
                                    var castedKey = item.key + '';
                                    var nKey = castedKey.substring(castedKey.lastIndexOf('.') + 1);
                                    var fld = this[nKey] || this[nKey.charAt(0).toLowerCase() + nKey.slice(1)];
                                    if (fld !== null && fld !== undefined && ko.validation.utils.isValidatable(fld))
                                    {
                                        if (item.value && item.value.length && item.value.length > 0)
                                        {
                                            fld.setError(item.value.join('\n'));
                                            result = true;
                                        }
                                    }
                                } else
                                {
                                    if (item.value && item.value.length && item.value.length > 0)
                                    {
                                        _.each(item.value, function (error)
                                        {
                                            notificationService.warning(error, null, { timeOut: 3500 });
                                        });
                                        result = true;
                                    }
                                }
                            }, this);
                            return result;
                        }
                    }
                    catch (e)
                    {
                        return false;
                    }
                }
                return false;
            };

            this.disposeModelState = function ()
            {
                clearTimeout(sid);
                _.each(subscriptions, function (item)
                {
                    item.dispose();
                }, this);
                subscriptions = null;

                this.isInProgress.dispose();
                this.modelState.dispose();
                this.stateCls.dispose();
                this.isDirty.dispose();

                for (var indexer in validationObject)
                {
                    if (validationObject[indexer]._disposeValidation)
                    {
                        try { validationObject[indexer]._disposeValidation(); } catch (e) { }
                    }
                }

                validationObject = null;
                trackerFn = null;
                validator = null;
                this.resetState = null;
                this.isValid = null;
                delete this.tryParseValidationResponse;
            };
        },
        release: function ()
        {
            this.disposeModelState();
            delete this.disposeModelState;
        }
    };
    return modelStateExtender;
});