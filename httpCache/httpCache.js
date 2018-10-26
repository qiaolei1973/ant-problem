/**
 * 2. 实现一个前端缓存模块，主要用于缓存 xhr 返回的结果，避免多余的网络请求浪费，要求
 *   2.1 生命周期为一次页面打开
 *   2.2 如果有相同的请求同时并行发起，要求其中一个能挂起并且等待另外一个请求返回并读取该缓存
 */

export default class Cache {
    constructor() {
        this.CACHE_KEY = 'custom_cache';
        this.xhr = new XMLHttpRequest();
        this.pool = {
            pending: {},
            cached: {},
            hang: {},
        };
        const originCached = sessionStorage.getItem(this.CACHE_KEY);
        if (originCached){
            // 防止sessionStorage的内容被篡改导致页面崩溃
            try{
                this.pool.cached = JSON.parse(originCached);
            }catch{
                console.error('错误的json格式');
            }
        }
            this.xhr.onreadystatechange = this.handleReadystatechange.bind(this);
    }

    handleReadystatechange() {
        if (this.xhr.readyState === 4) {
            if ((this.xhr.status >= 200 && this.xhr.status < 300) || this.xhr.status === 304) {
                const { custom: { options: { url } }, responseText } = this.xhr;
                this.pool.cached[url] = responseText;
                this.persisting();
                if (this.pool.pending[url]) {
                    this.pool.pending[url](responseText);
                    this.pool.pending[url] = null;
                }
                if (this.pool.hang[url]) {
                    this.pool.hang[url].forEach(callback => {
                        callback(responseText);
                    });
                    this.pool.hang[url] = null;
                }
            } else {
                console.error("请求失败！");
            }
        }
    }

    // 向sessionStorage做持久化
    persisting() {
        sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(this.pool.cached));
    }

    // 清空缓存
    removeCache() {
        sessionStorage.removeItem(this.CACHE_KEY);
    }

    // 发起请求（只做get请求的缓存 因为只有get请求的缓存有意义）
    fetch(url, callback) {
        if (this.pool.cached[url]) {
            callback(this.pool.cached[url]);
        } else if (this.pool.pending[url]) {
            if (!this.pool.hang[url]) {
                this.pool.hang[url] = [callback];
            } else {
                this.pool.hang[url].push(callback);
            }
        } else {
            this.xhr.open('get', url, true);
            this.pool.pending[url] = callback;
            this.xhr.send();
        }

    }
}