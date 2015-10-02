define(['ko', 'jquery', 'underscore', 'FilteredListViewModel'], function (ko, jquery, _, filteredListViewModelDef)
{
    'use strict';
    var pagedListViewModelDef = function (title)
    {
        if (!this.loadData)
        {
            throw 'In order to inherit "ListViewModel" type you must provide "loadData" method, which calls to get initial set of items';
        }
        this.namingOptions = jquery.extend(this.namingOptions || {}, { loaded: 'selectedCount', displayFrom: 'displayFrom', displayTo: 'displayTo' });

        this.minPageSize = 0;
        this.maxPageSize = 200;
        this.defaultPageSize = 20;
        this.pageSizeInternal = ko.observable(this.defaultPageSize);
        this.pageNumberInternal = ko.observable(1);
        this.displayFrom = ko.observable(1).extend({ rateLimit: 0 });
        this.displayTo = ko.observable(1).extend({ rateLimit: 0 });

        this.pageCount = ko.computed(
        {
            read: function ()
            {
                return Math.ceil(this.totalRecords() / this.pageSizeInternal());
            },
            deferEvaluation: true,
            owner: this
        });

        this.pageNumber = ko.computed({
            read: this.pageNumberInternal,
            write: function (value)
            {
                value = (value + String.Empty).replace(/[^0-9\.]/g, '');
                var pageNumber = value * 1 ? value * 1 : 1;

                if (pageNumber > this.pageCount())
                {
                    pageNumber = this.pageCount();
                }
                if (pageNumber < 1)
                {
                    pageNumber = 1;
                }
                this.pageNumberInternal(pageNumber);
                return pageNumber;
            },
            owner: this
        });

        this.pageSize = ko.computed({
            read: this.pageSizeInternal,
            write: function (value)
            {
                value = (value + String.Empty).replace(/[^0-9\.]/g, '');
                var pageSize = value * 1 ? value * 1 : this.defaultPageSize;


                if (pageSize > this.maxPageSize)
                {
                    pageSize = this.maxPageSize;
                }
                if (this.totalRecords() !== 0)
                {
                    if (pageSize > this.totalRecords())
                    {
                        pageSize = this.totalRecords();
                    }

                    if (this.pageNumber() * pageSize > this.totalRecords())
                    {
                        pageSize = Math.ceil(this.totalRecords() / this.pageNumber());
                        if (pageSize > this.maxPageSize)
                        {
                            pageSize = this.maxPageSize;
                        }
                    }
                }

                if (pageSize < this.minPageSize || pageSize === 0)
                {
                    pageSize = this.defaultPageSize;
                }



                if (this.pageNumber() === this.pageCount() && pageSize > this.pageSizeInternal())
                {
                    pageSize = this.pageSizeInternal();
                }

                this.pageSizeInternal(pageSize);
                return pageSize;
            },
            owner: this
        });

        this.loadData = _.wrap(this.loadData, function (q)
        {
            this.clearSelection();
            var promise = q.apply(this, Array.prototype.slice.call(arguments, 1));
            this.items.disposeAll();
            promise.done(function (data)
            {
                this.displayFrom(data[this.namingOptions.displayFrom] || 1);
                this.displayTo(data[this.namingOptions.displayTo] || 1);
            });

            return promise;
        });

        pagedListViewModelDef.superclass.constructor.call(this, title);
        this.totalRecordsText.dispose();
        this.totalRecordsText = ko.computed({
            read: function ()
            {
                return String.format(ETR.LocalResources.CommonPagedListTotalRecords, this.displayFrom(), this.displayTo(), this.totalRecords());
            }
        }, this);

        this.baseInit = _.wrap(this.baseInit, function (baseInit, params)
        {
            baseInit.call(this, params);
            if (params && params.pageNumber)
            {
                this.pageNumberInternal(params.pageNumber);
            }
            if (params && params.pageSize)
            {
                this.pageSize(params.pageSize);
            }
        });

        this.resetData = _.wrap(this.resetData, function (baseResetData)
        {
            baseResetData.call(this);
            this.pageNumber(1);
            this.pageSize(this.defaultPageSize);
        });

        this.toRequest = _.wrap(this.toRequest, function (baseToRequest)
        {
            var result = baseToRequest.call(this);
            result.pageNumber = this.pageNumber();
            result.pageSize = this.pageSize();
            return result;
        });

        this.getLocalState = _.wrap(this.getLocalState, function (baseGetLocalState)
        {
            var result = baseGetLocalState.call(this);
            result.pageSize = this.pageSize();
            return result;
        });

        this.baseDispose = _.wrap(this.baseDispose, function (baseDispose)
        {
            baseDispose.call(this);
            this.totalRecordsText.dispose();
            this.pageNumber.dispose();
            this.pageCount.dispose();
            this.pageSize.dispose();
            this.pageSizeInternal = null;
        });
    };
    _.extend(ETR.setSuperclass(pagedListViewModelDef, filteredListViewModelDef).prototype,
        {
            goToFirstPage: function ()
            {
                if (this.pageNumber() > 1)
                {
                    this.pageNumber(1).loadData();
                }
            },
            goToPreviousPage: function ()
            {
                if (this.pageNumber() > 1)
                {
                    this.pageNumber(this.pageNumber() - 1).loadData();
                }
            },
            goToNextPage: function ()
            {
                if (this.pageNumber() < this.pageCount())
                {
                    this.pageNumber(this.pageNumber() + 1).loadData();
                }
            },
            goToLastPage: function ()
            {
                if (this.pageNumber() < this.pageCount())
                {
                    this.pageNumber(this.pageCount()).loadData();
                }
            },
        });
    return pagedListViewModelDef;
});