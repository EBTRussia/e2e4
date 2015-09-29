define(['ko', 'jquery', 'WcfDispatcher', 'notificationService', 'jquery.iframe-transport', 'jquery.fileupload-ui'], function (ko, jquery, wcfDispatcher, notificationService)
{
    'use strict';
    ko.bindingHandlers.lazyUpload = {
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var uploadInited = false;
            var $element = jquery(element);
            var $initBtn = $element.find('[data-upload-init]');
            var $closeBtn = $element.find('[data-upload-hide]');
            var $viewport = $element.find('[data-upload-viewport]');
            var $form = null;

            var closeHandler = function (evt)
            {
                evt.stopPropagation();
                $element.find('[data-upload-viewport]').fadeOut();
            };

            var docClickHandler = function ()
            {
                $viewport.fadeOut();
            };
            var viewPortClickHandler = function (evt)
            {
                evt.stopPropagation();
            };

            var initHandler = function (evt)
            {
                evt.stopPropagation();
                if ($viewport.is(':visible'))
                {
                    jquery(document).off('click', docClickHandler);
                } else
                {
                    jquery(document).on('click', docClickHandler);
                }
                $viewport.fadeToggle();

                if (uploadInited === false)
                {
                    $viewport.click(viewPortClickHandler);
                    $form = $element.find('form');
                    var settings = {
                        url: $form.attr('action'),
                        autoUpload: true,
                        filesContainer: $form.find('[data-upload-drag-zone]')[0],
                        dropZone: $form.find('[data-upload-drag-zone]')[0],
                        sequentialUploads: true
                    };

                    jquery.extend(settings, ko.unwrap(valueAccessor()) || {});

                    if (settings.readonly)
                    {
                        delete settings.readonly;
                    }

                    $form.fileupload(settings);

                    if (valueAccessor() && ko.unwrap(valueAccessor().readonly) === true)
                    {
                        $form.fileupload('disable');
                    }

                    $form.fileupload('option', 'redirect', window.location.href.replace(/\/[^\/]*$/, '/cors/result.html?%s'));
                    $form.bind('fileuploadfail', ko.bindingHandlers.fileupload.toastHandler);

                    var callbacks = allBindingsAccessor.get('uploadCallbacks');

                    if (callbacks)
                    {
                        for (var indexer in callbacks)
                        {
                            $form.bind(indexer, callbacks[indexer]);
                        }
                    }
                    $form.data('content-loaded', false);
                    $element.addClass('fileupload-processing');
                    uploadInited = true;
                    jquery.ajax({
                        url: $form.fileupload('option', 'url'),
                        dataType: 'json',
                        context: $form[0]
                    }).always(function ()
                    {
                        $element.removeClass('fileupload-processing');
                    }).done(function (res)
                    {
                        jquery(this).data('content-loaded', true).fileupload('option', 'done').call(this, jquery.Event('done'), { result: res });
                    });
                }
            };
            $initBtn.click(initHandler);
            $closeBtn.click(closeHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                if (uploadInited)
                {
                    $form.fileupload('option', 'filesContainer').empty();
                    $form.fileupload('destroy');
                }
                if ($form !== null)
                {
                    $form.data('content-loaded', null);
                    $form = null;
                }
                $initBtn.off('click', initHandler);
                $closeBtn.off('click', closeHandler);
                $viewport.off('click', viewPortClickHandler);
                jquery(document).off('click', docClickHandler);

                $element = null;
                $initBtn = null;
                $closeBtn = null;
                $viewport = null;
                initHandler = null;
                closeHandler = null;
                docClickHandler = null;
            });
        }
    };
    ko.bindingHandlers.fileupload = {
        after: ['attr'],
        toastHandler: function (e, data)
        {
            if (data.jqXHR)
            {
                if (data.jqXHR.status === ETR.HttpStatusCode.OK)
                {
                    notificationService.error(ETR.LocalResources.CommonUserMessageErrorOnFileUpload);
                }
                else if (data.jqXHR.status === ETR.HttpStatusCode.Conflict)
                {
                    notificationService.error(ETR.LocalResources.CommonUserMessageDuplicateUploadFileName);
                }
                else
                {
                    wcfDispatcher.prototype.faultHandler(data.jqXHR);
                }
            }
        },
        init: function (element, valueAccessor, allBindingsAccessor)
        {
            var $element = jquery(element);
            var settings = {
                url: $element.attr('action'),
                autoUpload: true,
                dropZone: $element,
                sequentialUploads: true
            };
            jquery.extend(settings, ko.unwrap(valueAccessor()) || {});
            $element.fileupload(settings);
            $element.fileupload('option', 'redirect', window.location.href.replace(/\/[^\/]*$/, '/cors/result.html?%s'));
            $element.bind('fileuploadfail', ko.bindingHandlers.fileupload.toastHandler);
            $element.data('content-loaded', false);
            var callbacks = allBindingsAccessor.get('uploadCallbacks');

            if (callbacks)
            {
                for (var indexer in callbacks)
                {
                    $element.bind(indexer, callbacks[indexer]);
                }
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function ()
            {
                $element.fileupload('option', 'filesContainer').empty();
                $element.fileupload('destroy');
                $element.data('content-loaded', null);
                $element = null;
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor)
        {
            var $element = jquery(element);
            if (valueAccessor().readonly !== undefined && ko.unwrap(valueAccessor().readonly) === true)
            {
                $element.fileupload('disable');
            }
            else
            {
                $element.fileupload('enable');
            }
            var canLoad = allBindingsAccessor.get('load_content_after');
            if (canLoad === undefined || ko.unwrap(canLoad) === true)
            {
                if ($element.data('content-loaded') === false)
                {
                    $element.addClass('fileupload-processing');
                    jquery.ajax({
                        url: $element.fileupload('option', 'url'),
                        dataType: 'json',
                        context: $element[0]
                    }).always(function ()
                    {
                        jquery(this).removeClass('fileupload-processing');
                    }).done(function (result)
                    {
                        jquery(this).data('content-loaded', true).fileupload('option', 'done').call(this, jquery.Event('done'), { result: result });
                    });
                }
            }
        }
    };
});