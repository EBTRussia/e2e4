define(['ko'], function (ko)
{
    'use strict';
    var attachmentViewModelDef = function (attachment)
    {
        this.fileId = ko.observable(attachment.fileId);
        this.fileName = ko.observable(attachment.fileName);
        this.fileUrl = ko.observable(attachment.fileUrl);
    };
    return attachmentViewModelDef;
});