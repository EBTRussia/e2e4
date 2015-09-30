define(['ko', 'jquery', 'underscore', 'FilteredListViewModel'], function (ko, jquery, _, filteredListViewModelDef)
{
    'use strict';
    var bufferedListViewModelDef = function (title)
    {
        if (!this.loadData)
        {
            throw 'In order to inherit "ListViewModel" type you must provide "loadData" method, which calls to get initial set of items';
        }

        this.namingOptions = jquery.extend(this.namingOptions || {}, { total: 'totalCount', loaded: 'selectedCount' });
        this.defaultRowCount = 20;
        this.minRowCount = 0;
        this.maxRowCount = 200;
        this.rowCountInternal = ko.observable(this.defaultRowCount);
        this.skip = ko.observable(0).extend({ rateLimit: 0 });

        this.rowCount = ko.computed({
            read: this.rowCountInternal,
            write: function (value)
            {
                value = (value + String.Empty).replace(/[^0-9\.]/g, '');
                var rowCount = value * 1 ? value * 1 : this.defaultRowCount;
                if (rowCount < this.minRowCount)
                {
                    rowCount = this.defaultRowCount;
                }
                if (rowCount > this.maxRowCount)
                {
                    rowCount = this.maxRowCount;
                }
                if (this.totalRecords() !== 0)
                {
                    if (this.skip() + rowCount > this.totalRecords())
                    {
                        rowCount = this.totalRecords() - this.skip();
                    }
                }
                this.rowCountInternal(rowCount);
                return rowCount;
            },
            owner: this
        });

        this.loadData = _.wrap(this.loadData, function (q)
        {
            var promise = q.apply(this, Array.prototype.slice.call(arguments, 1));
            promise.done(function (data)
            {
                this.loadedRecords(this.skip() + data[this.namingOptions.loaded]);
                this.skip(this.skip() + data[this.namingOptions.loaded]);
                if ((data[this.namingOptions.total] || 0) === 0)
                {
                    this.resetData();
                }
            });
            return promise;
        });
        bufferedListViewModelDef.superclass.constructor.call(this, title);
        this.totalRecordsText.dispose();
        this.totalRecordsText = ko.computed({
            read: function ()
            {
                return String.format(ETR.LocalResources.CommonUserMessageTotalRecords, this.skip(), this.totalRecords());
            }
        }, this);


        this.baseInit = _.wrap(this.baseInit, function (baseInit, params)
        {
            baseInit.call(this, params);
            if (params && params.skip !== undefined && params.take !== undefined)
            {
                this.rowCount(params.skip + params.take);
            }
        });

        this.resetData = _.wrap(this.resetData, function (baseResetData)
        {
            baseResetData.call(this);
            this.skip(0);
            this.rowCount(this.defaultRowCount);
        });

        this.toRequest = _.wrap(this.toRequest, function (baseToRequest)
        {
            var result = baseToRequest.call(this);
            result.skip = this.skip();
            result.take = this.rowCount();
            return result;
        });

        this.changeSort = _.wrap(this.changeSort, function (baseChangeSort)
        {
            this.rowCount(this.defaultRowCount);
            this.skip(0);
            baseChangeSort.call(this);
        });

        this.baseDispose = _.wrap(this.baseDispose, function (baseDispose)
        {
            baseDispose.call(this);
            this.totalRecordsText.dispose();
            this.rowCount.dispose();
        });
    };
    Object.inherit(bufferedListViewModelDef, filteredListViewModelDef);
    return bufferedListViewModelDef;
});