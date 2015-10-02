define(['jquery', 'plugins/router', 'underscore'], function (jquery, router, _)
{
    'use strict';
    var stateManager = function ()
    {
        this.stateObject = {};
        router.guardRoute = _.bind(function (vmInstance, instruction)
        {
            vmInstance.__stateManagerKey = instruction.config.moduleId;
            var state = this.getModelState(instruction.config.moduleId);
            var persistedState = this.getPersistedState(instruction.config.moduleId);
            if (state || persistedState)
            {
                instruction.queryParams = jquery.extend(true, {}, persistedState || {}, state ? (state.lastRequestState || {}) : {}, instruction.queryParams);

                if (instruction.params.length > 0)
                {
                    instruction.params[instruction.params.length - 1] = instruction.queryParams;
                } else
                {
                    instruction.params.push(instruction.queryParams);
                }
            }
            return true;
        }, this);

        this.getModelState = function (moduleId)
        {
            return this.stateObject[moduleId];
        };
        this.flushRequestState = function (key, state)
        {
            this.stateObject[key] = this.stateObject[key] || {};
            var vmState = this.stateObject[key];
            setTimeout(function ()
            {
                var newState = {};
                jquery.extend(true, newState, state);
                vmState.lastRequestState = newState;
                var params = router.activeInstruction().queryParams || {};
                jquery.extend(params, vmState.lastRequestState);
                var path = router.activeInstruction().fragment + '?' + jquery.param(params);
                if (path.length <= ETR.UISettings.MaxQueryStringLength)
                {
                    router.navigate(path, { replace: true, trigger: false });
                }
                else
                {
                    for (var indexer in vmState.lastRequestState)
                    {
                        if (vmState.lastRequestState.hasOwnProperty(indexer))
                        {
                            delete params[indexer];
                        }
                    }
                    var cleanPath = router.activeInstruction().fragment + '?' + jquery.param(params);
                    router.navigate(cleanPath, { replace: true, trigger: false });
                }
            }, 0);
        };
        this.supportsStorage = function ()
        {
            try
            {
                return 'localStorage' in window && window.localStorage !== null;
            } catch (e)
            {
                return false;
            }
        };
        this.persistState = this.supportsStorage() ? function (key, state)
        {
            try
            {
                var data = { data: state };
                window.localStorage.setItem(key, JSON.stringify(data));
            } catch (e)
            {
                //supress QUOTA_EXCEEDED_ERR because we can't do anything with it
            }
        } : function () { };

        this.getPersistedState = this.supportsStorage() ? function (key)
        {
            var res = window.localStorage.getItem(key);
            if (res === null)
            {
                return undefined;
            }
            else
            {
                return JSON.parse(res).data;
            }
        } : function () { return undefined; };
    };
    return new stateManager();
});