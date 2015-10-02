define(['jquery', 'underscore', 'ko', 'BaseViewModel', 'SelectionExtender', 'stateManager', 'WcfDispatcher'], function (jquery, _, ko, baseViewModelDef, selectionExtender, stateManager, wcfDispatcherDef)
{
    'use strict';
    var listViewModelDef = function (title)
    {
        if (!this.loadData)
        {
            throw 'In order to inherit "ListViewModel" type you must provide "loadData" method, which calls to get initial set of items';
        }

        this.namingOptions = jquery.extend(this.namingOptions || {}, { total: 'totalCount', loaded: 'selectedCount' });
        this.cancellationSequence = [];

        this.stateManager = stateManager;
        this.saveModelState = true;
        this.totalRecords = ko.observable(0).extend({ rateLimit: 0 });
        this.loadedRecords = ko.observable(0).extend({ rateLimit: 0 });

        this.totalRecordsText = ko.computed({
            read: function ()
            {
                return ETR.formatString(ETR.LocalResources.CommonListTotalRecords, this.loadedRecords(), this.totalRecords());
            }
        }, this);

        this.isCollapsed = ko.observable(false);
        this.isGrouped = ko.observable(false);


        this.defaultSortings = [];
        if (this.sortings && ko.isObservable(this.sortings))
        {
            jquery.extend(true, this.defaultSortings, this.sortings());
            this.sortings.extend({ rateLimit: 0 });
        }
        else
        {
            this.sortings = ko.observableArray([]).extend({ rateLimit: 0 });
        }

        this.items = ko.observableArray([]).extend({ rateLimit: 0 });
        this.hasChild = ko.observable(false);

        if (this.contextActions && ko.isObservable(this.contextActions))
        {
            this.contextActions.extend({ rateLimit: 0 });
        }
        else
        {
            this.contextActions = ko.observableArray([]).extend({ rateLimit: 0 });
        }

        this.hasActiveActions = ko.computed(function ()
        {
            return _.find(this.contextActions(), function (action)
            {
                return ko.unwrap(action.active) === true;
            }) !== undefined;
        }, this);

        this.loadData = _.wrap(this.loadData, function (q)
        {
            this.totalRecords(0);
            this.state(ETR.ProgressState.Progress);
            var promise = this.addToCancellationSequence(q.apply(this, Array.prototype.slice.call(arguments, 1)));
            promise.done(function (data)
            {
                this.loadedRecords(data[this.namingOptions.loaded]);
                this.totalRecords(data[this.namingOptions.total] || 0);
                this.state(ETR.ProgressState.Done);
            }).fail(function ()
            {
                this.state(ETR.ProgressState.Fail);
            });

            if (this.saveModelState === true)
            {
                this.saveRequestState();
                this.saveLocalState();
            }
            return promise;
        });

        this.toRequest = this.getLocalState = function ()
        {
            var result = {};
            result.sort = this.sortings();
            return result;
        };

        listViewModelDef.superclass.constructor.call(this, title);

        this.loadButtonText = ko.computed(function ()
        {
            return this.ready() ? ETR.LocalResources.CommonUserMessageShowData : ETR.LocalResources.CommonUserMessageStopLoading;
        }, this);

        selectionExtender.apply.call(this, this.items);
        this.selectedItemsSubscription = this.selectedItems.subscribe(function ()
        {
            this.isCollapsed(this.selectedItems().length === 0);
        }, this);

        this.baseInit = _.wrap(this.baseInit, function (baseInit, params)
        {
            baseInit.call(this, params);
            if (params && params.sort && jquery.isArray(params.sort) && params.sort.length > 0)
            {
                this.sortings(jquery.extend(true, [], params.sort));
            }
        });
        this.baseDispose = _.wrap(this.baseDispose, function (baseDispose)
        {
            selectionExtender.release.call(this);
            this.loadButtonText.dispose();
            this.totalRecordsText.dispose();
            this.selectedItemsSubscription.dispose();
            this.hasActiveActions.dispose();
            this.contextActions.disposeAll();
            this.defaultSortings = null;
            this.items.disposeAll();
            this.sortings.removeAll();
            baseDispose.call(this);
        });

    };

    _.extend(ETR.setSuperclass(listViewModelDef, baseViewModelDef).prototype,
    {
        selectAll: function ()
        {
            var it = this.items();
            var i;
            if (this.isGrouped())
            {
                if (it.length > 0)
                {
                    for (i = it.length; i > 0; i--)
                    {
                        var subitems = it[i - 1].items();
                        if (subitems.length > 0)
                        {
                            for (var j = subitems.length; j > 0; j--)
                            {
                                this.setSelection(subitems[j - 1], true);
                            }
                        }
                    }
                }
                this.expandAll();
            }
            else
            {
                for (i = it.length; i > 0; i--)
                {
                    this.setSelection(it[i - 1], true);
                }
            }
        },
        deselectAll: function ()
        {
            var it = this.items();
            var i;
            if (this.isGrouped())
            {
                if (it.length > 0)
                {
                    for (i = it.length; i > 0; i--)
                    {
                        it[i - 1].clearSelection();
                    }
                }
            }
            else
            {
                this.clearSelection();
            }
        },
        collapseAll: function ()
        {
            if (!this.isGrouped())
            {
                throw 'collapseAll method can be used only when list is grouped.';
            }

            this.clearSelection();
        },
        expandAll: function ()
        {
            if (!this.isGrouped())
            {
                throw 'expandAll method can be used only when list is grouped.';
            }
            var it = this.items();
            var i;
            if (it.length > 0)
            {
                for (i = it.length; i > 0; i--)
                {
                    this.setSelection(it[i - 1], true);
                }
            }
        },
        getSelectedRows: function ()
        {
            var result = [];
            if (this.isGrouped())
            {
                _.each(this.items(), function (item)
                {
                    jquery.merge(result, item.selectedItems());
                });
            }
            else
            {
                jquery.merge(result, this.selectedItems());
            }
            return result;
        },

        addToCancellationSequence: function (q)
        {
            this.cancellationSequence.unshift(q);
            q.always(_.bind(function ()
            {
                var index = _.indexOf(this.cancellationSequence, q);
                if (index > -1)
                {
                    this.cancellationSequence.splice(index, 1);
                }
            }, this));
            return q;
        },
        setSort: function (fieldName, savePrevious)
        {
            var direction = { fieldName: fieldName, direction: ETR.SortOrder.ASC };

            for (var i = 0; i < this.sortings().length; i++)
            {
                if (this.sortings()[i].fieldName === fieldName)
                {
                    direction = this.sortings.splice(i, 1)[0];
                    direction.direction = ETR.SortOrder.toggle(direction.direction);
                    break;
                }
            }
            if (savePrevious)
            {
                this.sortings.push(direction);

            } else
            {
                this.sortings([direction]);
            }
        },
        resetSettings: function ()
        {
            this.sortings(jquery.extend(true, [], this.defaultSortings));
        },
        resetData: function ()
        {
            this.totalRecords(0);
            this.clearSelection();
            this.items.disposeAll();
        },
        changeSort: function ()
        {
            if (this.ready())
            {
                this.totalRecords(0);
                this.clearSelection();
                this.items.disposeAll();
                this.loadData();
            }
        },
        reload: function ()
        {
            if (this.ready())
            {
                this.resetData();
                this.loadData();
            }
        },
        cancelRequests: function ()
        {
            while (this.cancellationSequence.length > 0)
            {
                var call = this.cancellationSequence.shift();
                if (call)
                {
                    if (call.abort)
                    {
                        call.abort(wcfDispatcherDef.prototype.cancellationKey);
                    } else if (call.reject)
                    {
                        call.reject(wcfDispatcherDef.prototype.cancellationKey);
                    }
                }
            }
            this.state(ETR.ProgressState.Cancelled);
        },
        reloadOrCancel: function ()
        {
            if (this.ready())
            {
                this.reload();
            } else
            {
                this.cancelRequests();
            }
        },
        saveRequestState: function ()
        {
            this.stateManager.flushRequestState(this.__stateManagerKey, this.toRequest());
        },
        saveLocalState: function ()
        {
            this.stateManager.persistState(this.__stateManagerKey, this.getLocalState());
        }
    });

    return listViewModelDef;
});