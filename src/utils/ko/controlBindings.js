define(['ko', 'jquery', 'underscore'], function (ko, jquery, _)
{
    'use strict';
    ko.bindingHandlers.option = {
        update: function (element, valueAccessor)
        {
            var value = ko.utils.unwrapObservable(valueAccessor());
            ko.selectExtensions.writeValue(element, value);
        }
    };
    ko.bindingHandlers.stopBinding = {
        init: function ()
        {
            return { controlsDescendantBindings: true };
        }
    };
    ko.virtualElements.allowedBindings.stopBinding = true;

    ko.bindingHandlers.stopEvent = {
        stopFn: function (evt)
        {
            evt.stopPropagation();
        },
        init: function (element, valueAccessor)
        {
            jquery(element).on(valueAccessor(), ko.bindingHandlers.stopEvent.stopFn);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                jquery(element).off(valueAccessor(), ko.bindingHandlers.stopEvent.stopFn);
            });
        }
    };
    ko.bindingHandlers.keyCodeHandlers = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            var val = ko.unwrap(valueAccessor());
            var fnChecker = function (fnSettings, evt)
            {
                if (fnSettings)
                {
                    if (jquery.isFunction(fnSettings))
                    {
                        return fnSettings;
                    }
                    else if (fnSettings.ctrl && evt.ctrlKey === true)
                    {
                        return fnSettings.fn || null;
                    }
                    else if (fnSettings.shift && evt.shiftKey === true)
                    {
                        return fnSettings.fn || null;
                    }
                }
                return null;
            };

            var keyHandler = function (evt)
            {
                var func = null;
                switch (evt.keyCode)
                {
                    case ETR.KeyCodes.Esc:
                        func = fnChecker(val.esc, evt);
                        break;
                    case ETR.KeyCodes.Enter:
                        func = fnChecker(val.enter, evt);
                        break;
                    default:

                }
                if (func)
                {
                    func.call(viewModel, viewModel, evt);
                }
            };

            if (val.global === true)
            {
                jquery(window).on('keyup', keyHandler);
            } else
            {
                jquery(element).on('keyup', keyHandler);
            }
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (val.global === true)
                {
                    jquery(window).off('keyup', keyHandler);
                } else
                {
                    jquery(element).off('keyup', keyHandler);
                }
                keyHandler = null;
                fnChecker = null;
            });
        }
    };
    ko.bindingHandlers.updateIfNotEmpty = {
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var valBind = allBindingsAccessor.get('value');
            var keyUpFn = function ()
            {
                if (this.value)
                {
                    valBind(this.value);
                    this.value = valBind();
                }
            };
            jquery(element).on('keyup', keyUpFn);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                jquery(element).off('keyup', keyUpFn);
                keyUpFn = null;
            });
        }
    };
    ko.bindingHandlers.selectOnFocus = {
        init: function (element)
        {
            var focusFn = function ()
            {
                this.select();
            };
            var mouseUpFn = function ()
            {
                return false;
            };
            jquery(element).on('mouseup', mouseUpFn).on('focus', focusFn);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                jquery(element).off('mouseup', mouseUpFn).off('focus', focusFn);
                focusFn = null;
                mouseUpFn = null;
            });
        }
    };
    ko.bindingHandlers.fade = {
        init: function (element, valueAccessor)
        {
            var value = valueAccessor();
            jquery(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var val = ko.unwrap(valueAccessor());
            var hasIn = allBindingsAccessor.has('in');
            var hasOut = allBindingsAccessor.has('out');
            var $element = jquery(element);

            if (val === true)
            {
                if (hasIn || !hasOut)
                {
                    $element.stop(true, true).fadeIn(ETR.UISettings.ElementVisibilityInterval);

                } else
                {
                    $element.toggle(val);
                }

            } else if (val === false)
            {
                if (hasOut || !hasIn)
                {
                    $element.stop(true, true).fadeOut(ETR.UISettings.ElementVisibilityInterval);
                } else
                {
                    $element.toggle(val);
                }
            }
        }
    };
    ko.bindingHandlers.slide = {
        init: function (element, valueAccessor)
        {
            var value = valueAccessor();
            jquery(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var val = ko.unwrap(valueAccessor());
            var hasDown = allBindingsAccessor.has('down');
            var hasUp = allBindingsAccessor.has('up');
            var $element = jquery(element);

            if (val === true)
            {
                if (hasDown || !hasUp)
                {
                    $element.stop(true, true).slideDown(ETR.UISettings.ElementVisibilityInterval);

                } else
                {
                    $element.toggle(val);
                }

            } else if (val === false)
            {
                if (hasUp || !hasDown)
                {
                    $element.stop(true, true).slideUp(ETR.UISettings.ElementVisibilityInterval);
                } else
                {
                    $element.toggle(val);
                }
            }
        }
    };
    ko.bindingHandlers.goTop = {
        init: function (element, valueAccessor)
        {
            var $element = jquery(element);
            var $scrollTarget = jquery(ETR.UISettings.MainScrollAreaSelector);

            var visibleFrom = ko.unwrap(valueAccessor());

            var goToTop = function ()
            {
                var timing = ($scrollTarget.scrollTop() / 1000) * ETR.UISettings.ScrollToTopMaxTiming;
                timing = timing > ETR.UISettings.ScrollToTopMaxTiming ? ETR.UISettings.ScrollToTopMaxTiming : timing;
                if (ETR.UISettings.MainScrollAreaSelector === window || ETR.UISettings.MainScrollAreaSelector === 'window')
                {
                    jquery('html, body').animate({
                        scrollTop: 0
                    }, timing);
                }
                else
                {
                    $scrollTarget.animate({
                        scrollTop: 0
                    }, timing);
                }

            };
            var display = function ()
            {
                $element.stop(true, true).animate({ opacity: 1 }, ETR.UISettings.ElementHoverVisibilityInterval);
            };
            var hide = function ()
            {
                $element.stop(true, true).animate({ opacity: 0.4 }, ETR.UISettings.ElementVisibilityInterval);
            };
            var checkScroll = _.throttle(function ()
            {
                if (jquery(this).scrollTop() > visibleFrom)
                {
                    $element.show().stop(true, true).animate({ opacity: 0.4 }, ETR.UISettings.ElementVisibilityInterval);
                } else
                {
                    $element.hide().stop(true, true).animate({ opacity: 0 }, ETR.UISettings.ElementVisibilityInterval);
                }
            }, 200);

            $scrollTarget.scroll(checkScroll);
            $element.click(goToTop).mouseover(display).mouseout(hide);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $scrollTarget.off('scroll', checkScroll);
                $element.off('click', goToTop).off('mouseover', display).off('mouseout', hide);
                $scrollTarget = null;
                checkScroll = null;
                $element = null;

            });
        }
    };
    ko.bindingHandlers.collapseSwipe = {
        init: function (element, valueAccessor)
        {
            var hammerMgr = null;
            if (ETR.UISettings.SupportsTouch && window.Hammer)
            {
                hammerMgr = new window.Hammer(element);
                hammerMgr.get('swipe').set({ direction: window.Hammer.DIRECTION_ALL });

                hammerMgr.on('swipeup', function ()
                {
                    jquery(valueAccessor()).collapse('hide');
                    jquery(element).addClass('collapsed');
                });
                hammerMgr.on('swipedown', function ()
                {
                    jquery(valueAccessor()).collapse('show');
                    jquery(element).removeClass('collapsed');
                });
            }
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (hammerMgr !== null)
                {
                    hammerMgr.destroy();
                }
            });

        }
    };

    ko.bindingHandlers.bsoptions = {
        before: ['selectedOptions', 'value'],
        init: function (element)
        {
            var $el = jquery(element);
            $el.selectpicker();
            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $el.selectpicker('destroy');
                $el = null;
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            ko.unwrap(allBindingsAccessor.get('selectedOptions') || allBindingsAccessor.get('value'));
            ko.bindingHandlers.options.update(element, valueAccessor, allBindingsAccessor);
            var disable = allBindingsAccessor.get('disable');
            if (disable !== undefined)
            {
                //just to make observable loop update
                ko.unwrap(disable);
            }
            var enable = allBindingsAccessor.get('enable');
            if (enable !== undefined)
            {
                //just to make observable loop update
                ko.unwrap(enable);
            }

            setTimeout(function ()
            {
                jquery(element).selectpicker('refresh');
            }, 0);
        }
    };

    ko.bindingHandlers.carousel = {
        init: function (element, valueAccessor)
        {
            //do it in async manner for wait all markup
            setTimeout(function ()
            {
                jquery(element).carousel(ko.unwrap(valueAccessor()));
            }, 0);
        }
    };

    ko.bindingHandlers.bstooltip = {
        after: ['attr', 'localizedAttr'],
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            jquery(element).tooltip(ko.unwrap(valueAccessor()));
            var titleSubscription = null;
            var attr = allBindingsAccessor.get('localizedAttr') || allBindingsAccessor.get('attr');
            if (attr && attr.title && ko.isObservable(attr.title))
            {
                var previousVal = ko.unwrap(attr.title);
                titleSubscription = attr.title.subscribe(function (newVal)
                {
                    jquery(element).tooltip('hide')
                        .attr('data-original-title', newVal)
                        .tooltip('fixTitle');
                    if (previousVal)
                    {
                        jquery(element).tooltip('show');
                    }
                    previousVal = newVal;
                });
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (titleSubscription !== null)
                {
                    titleSubscription.dispose();
                }
                jquery(element).tooltip('destroy');
            });
        }
    };
    ko.bindingHandlers.validationTooltip =
        {
            init: function (element, valueAccessor, allBindingsAccessor)
            {
                if (!ko.validation || !ko.validation.utils || !ko.validation.utils.isValidatable)
                {
                    throw 'In order to use validationTooltip binding you must include knockout.validation library to your page';
                }

                var value = valueAccessor() === undefined ? allBindingsAccessor.get('value') : valueAccessor();
                var tooltipOptions = ko.unwrap(allBindingsAccessor.get('tooltipOptions')) || {};
                var displayMessageOn = allBindingsAccessor.get('displayMessageOn') || null;
                if (ko.validation.utils.isValidatable(value))
                {
                    var settings = {
                        delay: ETR.UISettings.ElementHoverDelay,
                        trigger: ETR.UISettings.SupportsTouch ? 'hover focus' : 'hover',
                        title: function ()
                        {
                            return value.error() || '';
                        }
                    };
                    settings = jquery.extend(settings, tooltipOptions);
                    var tl = jquery(element).tooltip(settings);

                    if (settings.trigger === 'manual')
                    {
                        tl.tooltip('show');
                    }

                    var subscription = value.isValid.subscribe(function ()
                    {
                        tl.tooltip(value.isValid() ? 'hide' : 'show');
                    });

                    var displaySubscription = null;
                    if (displayMessageOn)
                    {
                        displaySubscription = displayMessageOn.subscribe(function ()
                        {
                            tl.tooltip(value.isValid() ? 'hide' : 'show');
                        });
                    }

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
                    {
                        if (displaySubscription !== null)
                        {
                            displaySubscription.dispose();
                        }
                        subscription.dispose();
                        jquery(element).tooltip('destroy');
                    });
                }
            }
        };

    ko.bindingHandlers.bsprogress =
    {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel)
        {
            var progressState = ko.unwrap(viewModel.progressState);
            var progressMessage = ko.unwrap(viewModel.progressMessage);
            var el = jquery(element)[(progressState === 0 && !progressMessage) ? 'hide' : 'show']();
            el.find('[role="progressbar"]').css('width', progressState + '%');
            el.find('[role="status"]').text(progressMessage || '');
        }
    };

    ko.bindingHandlers.tableFloatHeader = {
        init: function (element)
        {
            var $el = jquery(element);
            var $thead = $el.children('thead').eq(0);
            var $scrollTarget = jquery(ETR.UISettings.MainScrollAreaSelector);
            var $createdEl = null;
            var checkScroll = _.throttle(function ()
            {

                if ($el.offset().top < $scrollTarget.offset().top)
                {
                    if ($createdEl === null)
                    {
                        if (jquery(window).width() - 12 < $el.outerWidth() + $el.offset().left)
                        {
                            return;
                        }
                        var $cols = $thead.find('td');

                        $createdEl = $thead.clone(true).addClass('floating-header').hide();

                        $createdEl.find('td').each(function (index, el)
                        {
                            jquery(el).width(jquery($cols[index]).outerWidth());
                        });

                        $createdEl.insertBefore($thead);

                        $createdEl.slideDown({ duration: 300, easing: 'linear' });
                    }
                } else
                {
                    if ($createdEl !== null)
                    {
                        $createdEl.stop(true, true).remove();
                        $createdEl = null;
                    }
                }
            }, 100, { leading: false });
            var destroyOnResize = function ()
            {
                if ($createdEl !== null)
                {
                    $createdEl.stop(true, true).remove();
                    $createdEl = null;
                }
            };

            $scrollTarget.scroll(checkScroll);
            jquery(window).resize(destroyOnResize);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $scrollTarget.off('scroll', checkScroll);
                jquery(window).off('resize', destroyOnResize);
                if ($createdEl !== null)
                {
                    $createdEl.remove();
                    $createdEl = null;
                }
                checkScroll = null;
                destroyOnResize = null;

                $scrollTarget = null;
                $thead = null;
                $el = null;
            });
        }
    };
});