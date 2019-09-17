define(function(require) {
    var monaco = require('vs/editor/editor.main');
    var $ = require('jquery');
    var obj = {
        editor: false,
        dom_object: require('./dom_object'),
        monaco_layout: function() {
            if (!obj.editor) return false;
            obj.editor.layout();
        },
        timeout_editor_changed: false,
        on_editor_change: function() {
            if (!obj.editor) return false;
            clearTimeout(obj.timeout_editor_changed);
            obj.timeout_editor_changed = setTimeout(function() {
                if (typeof obj.editor.on_change === 'function') obj.editor.on_change();
            }, 100);
        },
        init_monaco: function() {
            if (obj.editor_selector = obj.dom_object('editor')) {
                obj.editor_selector = obj.editor_selector.get(0);

                obj.editor = monaco.editor.create(obj.editor_selector, {
                    value: '',
                    theme: 'vs-dark',
                    language: 'javascript',
                    scrollBeyondLastColumn: true,
                    scrollBeyondLastLine: true,

                });
                obj.editor.onDidChangeModelContent(obj.on_editor_change);
                obj.editor.do_action = function(action) {
                    var actions = obj.editor.getActions();
                    for (var editor_action_index in actions) {
                        var editor_action = actions[editor_action_index];
                        if (editor_action.label === action) {
                            editor_action.run();
                            break;
                        }
                    }
                }
            }
            $(window).on('resize', function() {
                obj.monaco_layout();
            });
            obj.monaco_layout();
            return obj.editor;
        },
        init: function() {
            return obj.init_monaco();
        }
    };
    return obj.init();
});