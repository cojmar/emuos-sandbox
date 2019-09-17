define(function(){
    var obj = {
        use_get_files_contents:false,
        cache_prefix:'git_data!',
        cache:{},
        storage_usable:typeof(Storage) !== "undefined"?true:false,        
        get_cache:function(url){
            let item = obj.cache_prefix+url;
            let ret = !!obj.cache[item]?obj.cache[item]:false;
            if(!ret && obj.storage_usable){
                let s_data = window.localStorage.getItem(item);
                if (s_data){                                   
                    try{
                        s_data = JSON.parse(s_data);             
                    }
                    catch(e){
                        s_data = false;
                    }
                    if (s_data){
                        ret = obj.cache[url] = s_data;
                    }
                }
            }
            return ret;
        },
        set_cache:function(url,data){
            let item = obj.cache_prefix+url;
            obj.cache[item] = data;
            if(obj.storage_usable){
                window.localStorage.setItem(item,JSON.stringify(data));
            }
        },
        get_files_contents:function(data,callBack){
            let tmp_data =  JSON.parse(JSON.stringify(data));
            let ret_data = [];
            let files_count = 0;
            let loaded_count=0;
            for (let file_index in tmp_data){
                let file = tmp_data[file_index];
                if (file.type ==="file"){
                    files_count++;
                }
            }

            for (let file_index in tmp_data){
                let file = tmp_data[file_index];
                if (file.type ==="file"){
                    obj.load_url({url:file.download_url},function(data){
                        loaded_count++;
                        file.content = data.response;
                        ret_data.push(file);
                        if (loaded_count === files_count){
                            if (typeof callBack ==='function') callBack(ret_data);
                        }
                    });                      
                }
                else{
                    ret_data.push(file);
                }
            }                
        },
        load:function(url,callBack){
            obj.use_get_files_contents = false;
            if (!!url){                
                if (url.indexOf('get-content!')!==-1){
                    obj.use_get_files_contents = true;
                    url = url.split('get-content!').join('');
                }                
                if (url.indexOf('https://api.github.com/')===-1){
                    url = "https://api.github.com/"+url;
                }
            }
            var data = obj.get_cache(url)||{url:url};                
            obj.load_url(data,function(ret){                
                //console.log(ret);
                if (ret.modified) obj.set_cache(url,ret);
                if (obj.use_get_files_contents){                
                    if(Array.isArray(ret.response)){
                        obj.get_files_contents(ret.response,callBack);
                    }
                    else if (typeof callBack ==='function') callBack(ret.response);
                }else{
                    if (typeof callBack ==='function') callBack(ret.response);
                }
            });
        },
        load_url:function(data,callBack){
            let modified = false;
            let xml_http = new XMLHttpRequest();
            xml_http.onreadystatechange=function()
            {
                if (xml_http.readyState === 4){
                    let response = data.response || false;
                    if (xml_http.status === 200) {  
                        modified = true;
                        try{
                            response = JSON.parse(xml_http.response);
                        }
                        catch(e){
                            response = xml_http.response;
                        }
                    }
                    let ret =(data.url.indexOf('api.github.com')!==-1)?{
                        url:data.url,
                        token:xml_http.getResponseHeader('ETag'),
                        limit_remaining:xml_http.getResponseHeader('X-RateLimit-Remaining'),
                        limit_reset:xml_http.getResponseHeader('X-RateLimit-Reset'),
                        last_modified:xml_http.getResponseHeader('Last-Modified'),
                        status:xml_http.status,
                        modified:modified,
                        response:response
                    }:{
                        url:data.url,                            
                        status:xml_http.status,
                        modified:modified,
                        response:response
                    };
                    if (typeof callBack ==='function') callBack(ret);
                }
            }
            xml_http.open("GET", data.url);
            if (data && data.token) xml_http.setRequestHeader("If-None-Match", data.token);
            if (data && data.last_modified) xml_http.setRequestHeader("If-Modified-Since", data.last_modified);
            xml_http.send();
        }
    }   
    return {
        load : function(name, req, onLoad, config) {
            if (config.isBuild && config.inlineJSON === false ) {                
                onLoad(null);
            } else {                                
                obj.load(name,onLoad);
   
            }
        }
    };
});
