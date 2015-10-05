define(['ko', 'jquery', 'underscore', 'PagedListViewModel', 'BufferedListViewModel', 'ListViewModel', 'jQueryExtender'], function (ko, jquery, _, pagedListViewModelDef, bufferedListViewModelDef, listViewModelDef)
{
    'use strict';
    ko.bindingHandlers.sort = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            var $el = jquery(element);
            var fieldName = ko.unwrap(valueAccessor());

            var clickHandler = function (evt)
            {
                if (viewModel.ready())
                {
                    viewModel.setSort(fieldName, evt.ctrlKey);
                    viewModel.changeSort();
                }
            };
            $el.addClass('sortable').click(clickHandler);
            ko.computed(
            {
                read: function ()
                {
                    for (var i = 0; i < viewModel.sortings().length; i++)
                    {
                        if (viewModel.sortings()[i].fieldName === fieldName)
                        {
                            if (viewModel.sortings()[i].direction === ETR.SortOrder.ASC)
                            {
                                $el.removeClass('arrow-down').addClass('arrow-up');
                                return;
                            }
                            if (viewModel.sortings()[i].direction === ETR.SortOrder.DESC)
                            {
                                $el.removeClass('arrow-up').addClass('arrow-down');
                                return;
                            }
                        }
                    }
                    $el.removeClass('arrow-down arrow-up');
                },
                disposeWhenNodeIsRemoved: element
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $el.off('click', clickHandler);
                $el = null;
            });
        }
    };

    ko.bindingHandlers.infinite = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            if (false === (viewModel instanceof bufferedListViewModelDef))
            {
                throw '"Infinite" can be applied only to bufferedListViewModel instance.';
            }

            var $element = jquery(element);
            var $scrollTarget = jquery(ETR.UISettings.MainScrollAreaSelector);
            var checkScroll = _.throttle(function ()
            {
                if (viewModel.skip() < viewModel.totalRecords() && viewModel.state() === ETR.ProgressState.Done)
                {
                    var bottom = $scrollTarget.scrollTop() + ($scrollTarget[0] === window ? window.innerHeight : $scrollTarget.height());
                    var elTop = $element.position().top;
                    if (bottom >= elTop)
                    {
                        viewModel.loadData();
                    }
                }
            }, 200);
            $scrollTarget.scroll(checkScroll);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $scrollTarget.off('scroll', checkScroll);
                $scrollTarget = null;
                checkScroll = null;
                $element = null;
            });
        }
    };

    ko.bindingHandlers.rowNumber = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
        {
            var listViewModel = bindingContext.$parent;

            if ((listViewModel instanceof listViewModelDef) === false)
            {
                throw 'Context for rowNumber binding must be instance of ListViewModel or inherit from ListViewModel.';
            }
            else if (listViewModel instanceof bufferedListViewModelDef)
            {
                jquery(element).text(bindingContext.$index() + 1);
            }
            else if (listViewModel instanceof pagedListViewModelDef)
            {
                jquery(element).text(bindingContext.$index() + listViewModel.displayFrom());
            }
        }
    };

    ko.bindingHandlers.selectionCheckbox = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
        {
            ko.utils.registerEventHandler(element, 'click', function ()
            {
                if (element.checked === true)
                {
                    bindingContext.$parent.setSelection(viewModel, true);
                } else
                {
                    bindingContext.$parent.removeSelection(viewModel);
                }
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            element.checked = viewModel.selected();
        }
    };

    ko.bindingHandlers.selectedRow = {
        clearSelection: function ()
        {
            try
            {
                if (window.getSelection)
                {
                    window.getSelection().removeAllRanges();
                } else if (document.selection)
                {
                    document.selection.empty();
                }
            } catch (e)
            {

            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            if (viewModel.selected() === true)
            {
                jquery(element).find('input, button, a').eq(0).focus();
            }
        },
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
        {
            var $el = jquery(element);
            var listViewModel = bindingContext.$parent;
            if (bindingContext.$index() === 0)
            {
                var selFirstBinding = allBindingsAccessor.get('selectFirst');
                if (listViewModel.selectedItems().length === 0 && (selFirstBinding !== undefined && selFirstBinding !== null && ko.unwrap(selFirstBinding) === true))
                {
                    var selectable = allBindingsAccessor.get('selectable');
                    if (selectable === undefined || selectable === null || ko.unwrap(selectable) === true)
                    {
                        listViewModel.setSelection(viewModel);
                    }

                }
            }

            if (viewModel.selected() === true)
            {
                listViewModel.setSelection(viewModel);
            }
            var keyHandler = function (evt)
            {
                var selectable = allBindingsAccessor.get('selectable');
                if (selectable !== undefined && selectable !== null && ko.unwrap(selectable) === false)
                {
                    return;
                }

                var savePrevious = !!allBindingsAccessor.get('multiple');

                if (evt.keyCode === ETR.KeyCodes.ArrowUp && bindingContext.$index() > 0)
                {
                    if (listViewModel.indexSelected(bindingContext.$index() - 1))
                    {
                        listViewModel.removeSelection(viewModel);
                    }
                    listViewModel.selectAt(bindingContext.$index() - 1, (evt.ctrlKey || evt.shiftKey) && savePrevious);
                }
                //down
                if (evt.keyCode === ETR.KeyCodes.ArrowDown)
                {
                    if (listViewModel.indexSelected(bindingContext.$index() + 1))
                    {
                        listViewModel.removeSelection(viewModel);
                    }
                    listViewModel.selectAt(bindingContext.$index() + 1, (evt.ctrlKey || evt.shiftKey) && savePrevious);
                }
            };
            var mouseHandler = function (evt)
            {
                var selectable = allBindingsAccessor.get('selectable');
                if (selectable !== undefined && selectable !== null && ko.unwrap(selectable) === false)
                {
                    return;
                }

                if (viewModel.selected() === false || evt.which === 1)
                {
                    var toggleOnly = !!allBindingsAccessor.get('toggleOnly');
                    if (toggleOnly)
                    {
                        listViewModel.toggleSelection(viewModel, true);
                        setTimeout(function ()
                        {
                            ko.bindingHandlers.selectedRow.clearSelection();
                        }, 0);
                        return;
                    }
                }

                if (viewModel.selected() === false || evt.which === 1)
                {
                    var savePrevious = !!allBindingsAccessor.get('multiple');
                    if (evt.ctrlKey && savePrevious)
                    {
                        listViewModel.toggleSelection(viewModel, true);
                    }
                    else if (evt.shiftKey && savePrevious)
                    {
                        listViewModel.selectRange(viewModel);
                    }
                    else
                    {
                        listViewModel.toggleSelection(viewModel);
                    }
                    setTimeout(function ()
                    {
                        ko.bindingHandlers.selectedRow.clearSelection();
                    }, 0);
                }
            };

            $el.on('mouseup', mouseHandler).on('keydown', keyHandler);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $el.off('mouseup', mouseHandler).off('keydown', keyHandler);
                mouseHandler = null;
                keyHandler = null;
                $el = null;
                listViewModel = null;
            });
        }
    };

    ko.bindingHandlers.contextCatcher = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            if (false === (viewModel instanceof listViewModelDef))
            {
                throw '"contextCatcher" can be applied only to ListViewModel instance.';
            }
            var $el = jquery(element);
            var $ctx = jquery(ko.unwrap(valueAccessor())).css({ position: 'absolute', display: 'none' });

            var visibleSubHandler = function ()
            {
                if (viewModel.hasActiveActions() === true)
                {
                    $ctx.show();
                } else
                {
                    $ctx.hide();
                }
            };
            var visibleSub = viewModel.hasActiveActions.subscribe(visibleSubHandler);
            var clickHandler = function (evt)
            {
                setTimeout(function ()
                {
                    $ctx.trigger('mouseout');
                    if (viewModel.hasActiveActions() === true)
                    {
                        var parentOffset = $ctx.parent().offset();
                        var ctxWidth = $ctx.width();
                        var windowWidth = jquery(window).width();
                        var top = (evt.pageY - parentOffset.top - 10) < 0 ? 0 : evt.pageY - parentOffset.top - 10;
                        var left = (evt.pageX - parentOffset.left + ctxWidth) < 0 ? 0 : evt.pageX - parentOffset.left + ctxWidth;
                        left = left + ctxWidth + 100 > windowWidth ? windowWidth - ctxWidth - 100 : left;

                        $ctx.hide().css({
                            top: top,
                            left: left
                        }).fadeIn(ETR.UISettings.ElementVisibilityInterval);
                    }
                }, 0);
            };

            var keyHandler = function (evt)
            {
                if (evt.altKey === true && evt.keyCode === ETR.KeyCodes.Enter && $ctx.is(':visible'))
                {
                    $ctx.trigger('mouseover');
                    var fel = $ctx.find('input, button, a');
                    if (fel.length > 0)
                    {
                        fel.eq(0).focus();
                    }
                    return;
                }
                if (evt.keyCode === ETR.KeyCodes.Esc)
                {
                    $ctx.trigger('mouseout');
                    return;
                }
                if (evt.keyCode !== ETR.KeyCodes.ArrowUp && evt.keyCode !== ETR.KeyCodes.ArrowDown && evt.keyCode !== ETR.KeyCodes.Shift && evt.keyCode !== ETR.KeyCodes.Alt && evt.keyCode !== ETR.KeyCodes.Ctrl)
                {
                    $ctx.trigger('mouseout');
                    $ctx.hide();
                    return;
                }
            };
            $el.click(clickHandler).keyup(keyHandler);
            $ctx.keyup(keyHandler);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $el.off('click', clickHandler).off('keyup', keyHandler);
                $ctx.off('keyup', keyHandler);
                visibleSub.dispose();
                visibleSubHandler = null;
                clickHandler = null;
                keyHandler = null;
                $el = null;
                $ctx = null;
            });
        }
    };

    ko.bindingHandlers.navTo = {
        mixParamsAndNavigate: function (href, params, leanParams)
        {
            var emParams = jquery.parseQueryString(jquery.getQueryString(href));
            if (params)
            {
                var paramsObj = {};
                for (var indexer in params)
                {
                    if (params.hasOwnProperty(indexer))
                    {
                        var val = ko.unwrap(params[indexer]);
                        if (val && val.toRequest)
                        {
                            paramsObj[indexer] = val.toRequest();
                        } else
                        {
                            paramsObj[indexer] = val;
                        }
                    }
                }
                emParams = jquery.extend(emParams, paramsObj);
            }
            if (leanParams)
            {
                var currentParams = jquery.parseQueryString(jquery.getQueryString(window.location.href));
                emParams = jquery.extend(currentParams, emParams);
            }

            href = href || window.location.href;
            var matches = href.match(/^[^#]*(#.+)$/);
            var hash = matches ? matches[1] : '';
            var cleanHash = hash ? hash.replace(/\?([^#]*)?$/, '') : '';

            href = cleanHash + '?' + jquery.param(emParams);
            window.location.href = href;

        },
        init: function (element, valueAccessor)
        {
            var goToFn = function (evt)
            {
                evt.preventDefault();
                var hrefPattern = ko.unwrap(valueAccessor().href);
                var paramsObj = ko.unwrap(valueAccessor().params);
                var leanParams = ko.unwrap(valueAccessor().leanParams) !== false ? true : false;
                ko.bindingHandlers.navTo.mixParamsAndNavigate(hrefPattern, paramsObj, leanParams);
            };
            jquery(element).click(goToFn);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                jquery(element).off('click', goToFn);
                goToFn = null;
            });
        }
    };
    ko.bindingHandlers.dodgeBlock =
    {
        init: function (element, valueAccessor)
        {
            var handler = function ()
            {
                var $element = jquery(element);
                if (ko.unwrap(valueAccessor()) === true)
                {
                    jquery('html').addClass('has-dodged-content');
                    if (ETR.UISettings.HasAnimations)
                    {
                        $element.removeClass('dodged-out').addClass('dodged-in collapsed').one(ETR.UISettings.AnimationEndEventName, function ()
                        {
                            jquery(ETR.UISettings.MainScrollAreaSelector).scrollTop(0);
                        });
                    } else
                    {
                        $element.slideUp(800, function ()
                        {
                            jquery(ETR.UISettings.MainScrollAreaSelector).scrollTop(0);
                        });
                    }
                }
                if (ko.unwrap(valueAccessor()) === false)
                {
                    jquery('html').removeClass('has-dodged-content');
                    if (ETR.UISettings.HasAnimations)
                    {
                        $element.addClass('dodged-out').removeClass('dodged-in').one(ETR.UISettings.AnimationEndEventName, function ()
                        {
                            jquery(this).removeClass('collapsed');
                        });
                    } else
                    {
                        jquery(element).slideDown(800);
                    }
                }
            };
            var subscription = valueAccessor().subscribe(handler);
            if (ko.unwrap(valueAccessor()) === true)
            {
                handler();
            }
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                jquery('html').removeClass('has-dodged-content');
                subscription.dispose();
                handler = null;
            });
        }
    };

});