define(function(require) {
    require('css!assets/css/main');    
    var $ = require('jquery');    
    //require('css!assets/css/jquery-ui');require('jquery-ui.min');        
    //require('bootstrap.min');require('css!assets/css/bootstrap.min');
    require('jquery-resizable');
    var app = {                
        debug: require('print'),
        editor: require('./editor'),
        preview: require('./preview'),
        current_item_data:['','',''],
        on_editor_change: function() {            
            app.current_item_data[1] = app.editor.getValue();
            if(!app.no_preview) app.preview.setValue(app.current_item_data.join(''),app.config);
        },
        init_config:function(){
            app.config={
                baseurl:false,
                repo:false,
                capsule:false,
            };
            let url_params = new URLSearchParams(window.location.search);
            for (var n in app.config) if(url_params.has(n)) app.config[n] = url_params.getAll(n);  
            //app.debug(app.config);
            
            let menu_url = 'git-folder!get-content!repos/' + app.config.repo;
            if (app.config.repo) require([menu_url],function(data){
                app.menu_items = data;
                app.init_menu();
            });
            
            return app;
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
            return app;
        },
        show_active_menu_item:function(){
            let item = $('.menu-item.active').data('item');
            let ov = tmp_val = app.menu_items[item].content;            
            app.current_item_data = [];
            if(app.config.capsule && Array.isArray(app.config.capsule)){                
                for (let i in app.config.capsule){
                    let capsule_item = app.config.capsule[i];
                    let tmp_index = tmp_val.indexOf(capsule_item);
                    if (tmp_index !==-1){
                        if (i==0) tmp_index += capsule_item.length;
                        app.current_item_data.push(tmp_val.substring(0,tmp_index));
                        tmp_val = tmp_val.substring(tmp_index);                        
                    }
                }                
                app.current_item_data.push(tmp_val);
            }
            if (app.current_item_data.length<1){
                app.current_item_data = ['',ov,''];
            }
            
            app.current_item_data[1] = app.current_item_data[1].split('\t\t').join('\t');
            app.current_item_data[1] = app.current_item_data[1].split('\t\t').join('~T2~');
            app.current_item_data[1] = app.current_item_data[1].split('\t\t\t').join('~T3~');
            app.current_item_data[1] = app.current_item_data[1].split('\t\t\t\t').join('~T4~');
            app.current_item_data[1] = app.current_item_data[1].split('\t\t\t\t\t').join('~T5~');
            app.current_item_data[1] = app.current_item_data[1].split('\t').join('');
            app.current_item_data[1] = app.current_item_data[1].split('~T2~').join('\t');
            app.current_item_data[1] = app.current_item_data[1].split('~T3~').join('\t\t');
            app.current_item_data[1] = app.current_item_data[1].split('~T4~').join('\t\t\t');
            app.current_item_data[1] = app.current_item_data[1].split('~T5~').join('\t\t\t\t');


            app.no_preview = true;
            app.editor.setValue(app.current_item_data[1]);
            app.no_preview = false;
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
            return app;
        },
        init: function() {
            app.init_config()                
                .init_resize()
                .init_editor();            
            app.debug("App Init Ok");            
        }
    };
    $(function() {
        app.init();        
    });        
});