define(function(require) {
    require('css!assets/css/main');    
    var $ = require('jquery');    
    //require('css!assets/css/jquery-ui');require('jquery-ui.min');        
    //require('bootstrap.min');require('css!assets/css/bootstrap.min');
    require('jquery-resizable');
    var app = {        
        menu_items:require('git-folder!get-content!repos/cojmar/charts/contents/assets/preview_files?ref=master'),
        debug: require('print'),
        editor: require('./editor'),
        preview: require('./preview'),
        on_editor_change: function() {
            var val = app.editor.getValue();
            app.preview.setValue(val);
        },
        init_editor: function() {
            app.editor.on_change = app.on_editor_change;
            return app;
        },
        init_resize:function(){
            $(".panel-left").resizable({
                handleSelector: ".splitter",
                resizeHeight: false,
                onDrag:function(){
                    app.editor.layout();                    
                },
                onDragEnd:function(){
                    app.editor.layout();                    
                }
            });
        },
        show_active_menu_item:function(){
            var item = $('.menu-item.active').data('item');
            app.editor.setValue(app.menu_items[item].content);
            app.editor.do_action('Format Document');
        },
        init_menu:function(){                    
            for (var n in app.menu_items){                                            
                $('#menu').append('<div class="menu-item" data-item="'+n+'">'+app.menu_items[n].name+'</div>');
            }            
            $('.menu-item').on('click',function(){
                $('.menu-item').removeClass('active');
                $(this).addClass('active');
                app.show_active_menu_item();
            });
            $($('.menu-item').get(0)).addClass('active');
            app.show_active_menu_item();
        },
        init: function() {
            app.init_menu();
            app.init_resize();
            app.init_editor();            
            app.debug("App Init Ok");            
        }
    };
    $(function() {
        app.init();        
    });        
});