define(['plugins/router', 'jquery', 'notificationService', 'underscore', 'statusTracker', 'i18n!nls/localResources'], function (router, jquery, notificationService, _, statusTracker, localResources)
{
    'use strict';
    var incrementor = 1;
    var wcfDispatcherDef = function (requestContext)
    {
        this.requestContext = requestContext || undefined;
        this.rejectsOnDispose = {};
    };
    _.extend(wcfDispatcherDef.prototype,
    {
        cancellationKey: '5FB28410-9217',
        callService: function (settings, statusMessage, singletKey)
        {
            var callSettings = {
                type: settings.method || ETR.HttpVerb.POST,
                contentType: settings.contentType || 'application/json; charset=utf-8',
                dataType: settings.dataType || undefined,
                url: settings.relativeUrl ? ETR.serviceURL + settings.relativeUrl : settings.url,
                data: settings.data ? ((settings.method === ETR.HttpVerb.GET || settings.data + '' === settings.data) ? settings.data : JSON.stringify(settings.data)) : undefined,
                context: settings.context || this.requestContext,
                beforeSend: settings.beforeSend || undefined,
                headers: settings.headers || undefined,
            };

            if (singletKey)
            {
                var singlet = wcfDispatcherDef.singletsCalls[singletKey];
                if (singlet)
                {
                    var singletResolver = jquery.Deferred();
                    singlet.done(function ()
                    {
                        singletResolver.resolveWith(callSettings.context, jquery.makeArray(arguments));
                    }).fail(function ()
                    {
                        singletResolver.rejectWith(callSettings.context, jquery.makeArray(arguments));
                    });
                    return singletResolver;
                }
            }

            var sid = statusMessage ? statusTracker.trackStatus(statusMessage) : null;
            var promise = this.makeServiceCall(callSettings);

            if (singletKey)
            {
                wcfDispatcherDef.singletsCalls[singletKey] = promise;
            }

            promise.done(_.bind(function ()
            {
                if (sid !== null)
                {
                    statusTracker.resolveStatus(sid, ETR.ProgressState.Done);
                }
                if (singletKey && wcfDispatcherDef.singletsCalls[singletKey])
                {
                    delete wcfDispatcherDef.singletsCalls[singletKey];
                }

            }, this)).fail(_.bind(function ()
            {
                if (sid !== null)
                {
                    statusTracker.resolveStatus(sid, ETR.ProgressState.Fail);
                }
                if (singletKey && wcfDispatcherDef.singletsCalls[singletKey])
                {
                    delete wcfDispatcherDef.singletsCalls[singletKey];
                }
            }, this));
            return promise;
        },
        refreshToken: function ()
        {
            if (wcfDispatcherDef.frameLoadPromise === undefined)
            {
                return jquery.Deferred(function (d)
                {
                    wcfDispatcherDef.frameLoadPromise = d;
                    var iFrame = jquery('<iframe></iframe>');
                    iFrame.hide();
                    iFrame.appendTo('body');
                    iFrame.attr('src', wcfDispatcherDef.PreauthUrl);
                    iFrame.load(function ()
                    {
                        setTimeout(function ()
                        {
                            wcfDispatcherDef.frameLoadPromise = undefined;
                            d.resolve();
                            iFrame.remove();
                        }, 1000);
                    });
                });
            } else
            {
                return wcfDispatcherDef.frameLoadPromise;
            }
        },
        makeServiceCall: function (settings, initialPromise)
        {
            var self = this;
            var d = initialPromise || jquery.Deferred();
            var requestId = ++incrementor;

            var promise = jquery.ajax(settings)
                        .done(function ()
                        {
                            delete self.rejectsOnDispose[requestId];
                            d.resolveWith(settings.context || self.requestContext || self, jquery.makeArray(arguments));
                        }).fail(function (error)
                        {
                            delete self.rejectsOnDispose[requestId];
                            if (error.status * 1 === ETR.HttpStatusCode.Unauthorized && wcfDispatcherDef.HandleUnauthorizedError === true)
                            {
                                if (!wcfDispatcherDef.PreauthUrl || !wcfDispatcherDef.AuthDialog)
                                {
                                    throw 'Dispatcher HandleUnauthorizedError flag is true, but PreauthUrl and AuthDialog properties are not specified';
                                }

                                if (initialPromise)
                                {
                                    wcfDispatcherDef.AuthDialog.show().done(function (result)
                                    {
                                        if (result === true)
                                        {
                                            self.makeServiceCall.call(self, settings, d).done(function ()
                                            {
                                                d.resolveWith(settings.context || self.requestContext || self, jquery.makeArray(arguments));
                                            });
                                        } else
                                        {
                                            router.navigate('#forbidden');
                                        }
                                    });
                                } else
                                {
                                    self.refreshToken().then(function ()
                                    {
                                        self.makeServiceCall.call(self, settings, d).done(function ()
                                        {
                                            d.resolveWith(settings.context || self.requestContext || self, jquery.makeArray(arguments));
                                        });
                                    });
                                }
                            } else
                            {
                                d.rejectWith(settings.context || self.requestContext || self, jquery.makeArray(arguments));
                            }
                        });

            this.rejectsOnDispose[requestId] = promise;
            return d;
        },
        dispose: function ()
        {
            for (var indexer in this.rejectsOnDispose)
            {
                this.rejectsOnDispose[indexer].abort(wcfDispatcherDef.prototype.cancellationKey);
                delete this.rejectsOnDispose[indexer];
            }
            this.rejectsOnDispose = null;
            this.requestContext = null;
        },
        faultHandler: function (result)
        {
            for (var i = 0; i < wcfDispatcherDef.faultHandlers.length; i++)
            {
                if (wcfDispatcherDef.faultHandlers[i](result) === false)
                {
                    break;
                }
            }
        },
        notFoundHandler: function (result)
        {
            if (result.status === ETR.HttpStatusCode.NotFound)
            {
                notificationService.error(wcfDispatcherDef.NotFoundMessage);
                return false;
            }
            return true;
        },
        forbiddenHandler: function (result)
        {
            if (result.status === ETR.HttpStatusCode.Forbidden)
            {
                notificationService.error(wcfDispatcherDef.ForbiddenMessage);
                return false;
            }
            return true;
        },
        commonFaultHandler: function (result)
        {
            var resultData = wcfDispatcherDef.tryParseFaultResponse(result);
            if (resultData !== null && resultData !== undefined)
            {
                if (jquery.isArray(resultData))
                {
                    _.each(resultData, function (error)
                    {
                        switch (error.faultLevel)
                        {
                            case ETR.FaultLevel.Info:
                                notificationService.info(error.faultMessage);
                                return;
                            case ETR.FaultLevel.Warning:
                                notificationService.warning(error.faultMessage);
                                return;
                            case ETR.FaultLevel.Error:
                                notificationService.error(error.faultMessage);
                                return;
                        }
                    });
                } else
                {
                    switch (resultData.faultLevel)
                    {
                        case ETR.FaultLevel.Info:
                            notificationService.info(resultData.faultMessage);
                            return;
                        case ETR.FaultLevel.Warning:
                            notificationService.warning(resultData.faultMessage);
                            return;
                        case ETR.FaultLevel.Error:
                            notificationService.error(resultData.faultMessage);
                            return;
                    }
                }
                return;
            }
            if (result.responseText)
            {
                notificationService.error(result.responseText);
            }
            else if (result.statusText && result.statusText !== wcfDispatcherDef.prototype.cancellationKey && result.status !== 0)
            {
                notificationService.error(result.statusText);
            }
        }
    });
    wcfDispatcherDef.PreauthUrl = undefined;
    wcfDispatcherDef.AuthDialog = undefined;
    wcfDispatcherDef.HandleUnauthorizedError = true;
    wcfDispatcherDef.NotFoundMessage = localResources.CommonUserMessageNotFound;
    wcfDispatcherDef.ForbiddenMessage = localResources.CommonUserMessageForbidden;
    wcfDispatcherDef.singletsCalls = {};
    wcfDispatcherDef.faultHandlers = [wcfDispatcherDef.prototype.forbiddenHandler, wcfDispatcherDef.prototype.notFoundHandler, wcfDispatcherDef.prototype.commonFaultHandler];
    wcfDispatcherDef.tryParseFaultResponse = wcfDispatcherDef.prototype.tryParseFaultResponse = function (result)
    {
        try
        {
            var resultData = jquery.parseJSON(result.responseText);
            if (resultData && resultData.faultMessage !== undefined && resultData.faultLevel !== undefined)
            {
                return resultData;
            }
            if (resultData && jquery.isArray(resultData) && resultData.length > 0 && resultData[0].faultMessage !== undefined && resultData[0].faultLevel !== undefined)
            {
                return resultData;
            }
            return null;
        }
        catch (e)
        {
            return null;
        }
    };
    return wcfDispatcherDef;
});