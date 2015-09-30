define(['ko'], function (ko)
{
    'use strict';
    var selectionExtender = {
        apply: function (source)
        {
            this.selectedItems = ko.observableArray([]).extend({ rateLimit: 0 });
            var itemsSource = source;

            this.setSelection = function (viewModel, savePrevious)
            {
                var key = ko.unwrap(viewModel.key);
                var i;
                if (savePrevious === true)
                {
                    this.selectedItems.remove(function (item) { return item.key === key; });
                    this.selectedItems.push({ key: key, model: viewModel });
                    viewModel.selected(true);
                }
                else
                {
                    var list = this.selectedItems.removeAll();
                    for (i = 0; i < list.length; i++)
                    {
                        if (list[i].model !== null)
                        {
                            list[i].model.selected(false);
                        }
                        list[i].model = null;
                    }
                    this.selectedItems.push({ key: key, model: viewModel });
                    viewModel.selected(true);
                }
            };
            this.indexSelected = function (index)
            {
                var data = ko.unwrap(itemsSource);
                if (index >= 0 && data.length > index)
                {
                    return data[index].selected();
                }
                return false;
            };
            this.selectAt = function (index, savePrevious)
            {
                var data = ko.unwrap(itemsSource);
                if (index >= 0 && data.length > index)
                {
                    this.setSelection(data[index], savePrevious);
                    return data[index];
                }
                return null;
            };

            this.toggleSelection = function (viewModel, savePrevious)
            {
                if (viewModel.selected() === true)
                {
                    if (this.selectedItems().length === 1 || (this.selectedItems().length > 1 && savePrevious === true))
                    {
                        this.removeSelection(viewModel);
                    } else
                    {
                        this.setSelection(viewModel, savePrevious);
                    }
                    return;
                }
                this.setSelection(viewModel, savePrevious);
            };
            this.removeSelection = function (viewModel)
            {
                var key = ko.unwrap(viewModel.key);
                this.selectedItems.remove(function (item) { return item.key === key; });
                viewModel.selected(false);
            };
            this.hasSelections = ko.computed(function ()
            {
                return this.selectedItems().length !== 0;
            }, this);
            this.clearSelection = function ()
            {
                var list = this.selectedItems.removeAll();
                for (var i = 0; i < list.length; i++)
                {
                    list[i].model.selected(false);
                    list[i].model = null;
                }
            };
            this.selectRange = function (toViewModel)
            {
                if (this.selectedItems().length === 0)
                {
                    return;
                }
                var firstBoundKey = ko.unwrap(this.selectedItems()[this.selectedItems().length - 1].key);
                var secondBoundKey = ko.unwrap(toViewModel.key);
                var firstBoundReached = false;
                var secondBoundReached = false;
                this.clearSelection();
                var data = ko.unwrap(itemsSource);
                var tempData = [];

                for (var i = 0; i < data.length; i++)
                {
                    var vm = data[i];
                    var vmKey = ko.unwrap(vm.key);
                    if (vmKey === firstBoundKey)
                    {
                        firstBoundReached = true;
                    }
                    if (vmKey === secondBoundKey)
                    {
                        secondBoundReached = true;
                    }
                    if (firstBoundReached === true || secondBoundReached === true)
                    {
                        tempData.push({ key: vmKey, model: vm });
                        vm.selected(true);
                    }
                    if (firstBoundReached === true && secondBoundReached === true)
                    {
                        this.selectedItems(tempData);
                        return;
                    }
                }
            };
        },
        release: function ()
        {
            var list = this.selectedItems.removeAll();
            for (var i = 0; i < list.length; i++)
            {
                list[i].model = null;
            }
            this.hasSelections.dispose();
        }
    };
    return selectionExtender;
});