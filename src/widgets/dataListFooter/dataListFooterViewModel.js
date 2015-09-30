define(['underscore', 'ko', 'jquery', 'BufferedListViewModel', 'PagedListViewModel', 'ListViewModel'],
    function (_, ko, jquery, bufferedListViewModelDef, pagedListViewModelDef, listViewModelDef)
    {
        'use strict';
        var datalistFooterViewModelDef = function () { };
        _.extend(datalistFooterViewModelDef.prototype, {
            activate: function (settings)
            {
                this.noDataText = settings.noDataText || ETR.LocalResources.CommonUserMessageNoData;
                this.cancelStatusText = settings.cancelStatusText || ETR.LocalResources.CommonUserMessageCancelledListMessage;
                this.failedStatusText = settings.failedStatusText || ETR.LocalResources.CommonUserMessageFailedListMessage;
                this.initialStatusText = settings.initialStatusText || ETR.LocalResources.CommonUserMessageInitialListMessage;
                this.displayPagingControls = jquery(settings.parent).attr('data-bind').indexOf('infinite') === -1;

                this.isSimpleList = false;
                this.isPagedList = false;
                this.isBufferedList = false;

                this.displayProgress = ko.computed({
                    read: function ()
                    {
                        return settings.bindingContext.$data.busy();
                    },
                }, this);

                this.displayPager = ko.computed({
                    read: function ()
                    {
                        return settings.bindingContext.$data.state() === ETR.ProgressState.Done && settings.bindingContext.$data.totalRecords() !== 0;
                    },
                }, this);

                this.displayNoData = ko.computed({
                    read: function ()
                    {
                        if (settings.bindingContext.$data.state() === ETR.ProgressState.Done && settings.bindingContext.$data.loadedRecords() === 0)
                        {
                            return true;
                        } else
                        {
                            return false;
                        }
                    },
                }, this);

                this.displayCancelStatus = ko.computed({
                    read: function ()
                    {
                        return settings.bindingContext.$data.state() === ETR.ProgressState.Cancelled;
                    },
                }, this);

                this.displayFailedStatus = ko.computed({
                    read: function ()
                    {
                        return settings.bindingContext.$data.state() === ETR.ProgressState.Fail;
                    },
                }, this);

                this.displayInitialStatus = ko.computed({
                    read: function ()
                    {
                        return settings.bindingContext.$data.state() === ETR.ProgressState.Initial;
                    },
                }, this);

                this.listViewModel = settings.bindingContext.$data;
                if (settings.bindingContext.$data instanceof bufferedListViewModelDef)
                {
                    this.isBufferedList = true;
                }
                else if (settings.bindingContext.$data instanceof pagedListViewModelDef)
                {
                    this.isPagedList = true;
                }
                else if (settings.bindingContext.$data instanceof listViewModelDef)
                {
                    this.isSimpleList = true;
                }
            },
            detached: function ()
            {
                this.displayNoData.dispose();
                this.displayProgress.dispose();
                this.displayPager.dispose();
                this.displayCancelStatus.dispose();
                this.displayFailedStatus.dispose();
                this.displayInitialStatus.dispose();
            }
        });
        return datalistFooterViewModelDef;
    });