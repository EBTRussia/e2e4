define(['WcfDispatcher', 'jquery', 'notificationService', 'underscore', 'statusTracker', 'i18n!nls/localResources', '$fileDownload'], function (wcfDispatcherDef, jquery, notificationService, _, statusTracker, localResources)
{
    'use strict';
    _.extend(wcfDispatcherDef.prototype,
    {
        downloadFile: function (url, statusMessage)
        {
            var sid = statusMessage ? statusTracker.trackStatus(statusMessage) : null;
            var q = jquery.Deferred();
            jquery.fileDownload(url)
                .done(_.bind(function ()
                {
                    if (sid !== null)
                    {
                        statusTracker.resolveStatus(sid, ETR.ProgressState.Done);
                    }
                    q.resolveWith(this.requestContext || this, jquery.makeArray(arguments));
                }, this))
                .fail(_.bind(function ()
                {
                    if (sid !== null)
                    {
                        statusTracker.resolveStatus(sid, ETR.ProgressState.Fail);
                    }
                    q.rejectWith(this.requestContext || this, jquery.makeArray(arguments));
                }, this));
            return q;
        },
        fileFaultHandler: function ()
        {
            notificationService.error(wcfDispatcherDef.ErrorOnFileDownload);
        }
    });
    wcfDispatcherDef.ErrorOnFileDownload = localResources.CommonUserMessageErrorOnFileDownload;
    return wcfDispatcherDef;
});