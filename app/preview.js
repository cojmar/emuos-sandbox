define(function(require) {
    var obj = {
        dom_object: require('./dom_object'),        
        preview_selector: false,        
        process_data:function(data,config){            
            let ret = data;            
            if(config.baseurl){
                ret = ret.replace('<head>','<head><base href="'+config.baseurl+'">');                
            }             
            return ret;
        },
        set_preview: function(data,config) {
            if (!obj.preview_selector.html) return false;
            obj.preview_selector.html('<iframe id="preview_frame" style="width:100%;height:100%;border:none;" />');
            var iframe = document.getElementById('preview_frame');
            iframe = iframe.contentWindow || (iframe.contentDocument.document || iframe.contentDocument);
            iframe.document.open();            
            iframe.document.write(obj.process_data(data,config));
            iframe.document.close();
        },
        init_preview: function() {
            obj.preview_selector = obj.dom_object('preview');
        },
        init: function() {
            obj.init_preview();
            return {
                setValue: obj.set_preview
            }
        }
    };
    return obj.init();
});