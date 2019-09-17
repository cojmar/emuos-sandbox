define(function(require) {
    var obj = {
        dom_object: require('./dom_object'),
        preview_head: require('text!assets/preview.html'),
        preview_selector: false,        
        process_data:function(data){
            if (!obj.url_params) obj.url_params = new URLSearchParams(window.location.search);
            let ret = data;            
            if(obj.url_params.has('baseurl')){
                ret = ret.split('<head>').join('<head><base href="'+obj.url_params.get('baseurl')+'">');                
            }             
            return ret;
        },
        set_preview: function(data) {
            if (!obj.preview_selector.html) return false;
            obj.preview_selector.html('<iframe id="preview_frame" style="width:100%;height:100%;border:none;" />');
            var iframe = document.getElementById('preview_frame');
            iframe = iframe.contentWindow || (iframe.contentDocument.document || iframe.contentDocument);
            iframe.document.open();
            iframe.document.write(obj.preview_head);
            iframe.document.write(obj.process_data(data));
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