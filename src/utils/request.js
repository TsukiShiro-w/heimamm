import axios from 'axios';
import { Message } from 'element-ui';
import { getToken, removeToken } from '@/utils/token.js'
import router from '@/router/index.js'
// 创建实例时设置配置的默认值
var instance = axios.create({
    //设置基地址
    baseURL: process.env.VUE_APP_URL,
    //跨域照样携带cookie
    withCredentials: true,
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (getToken()) {
        config.headers.token = getToken();
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.code == 200) {
        return response.data;
    } else if (response.data.code == 206) {
        router.push('/');
        Message.error('用户登录超时');
        removeToken();
    } else {
        Message.error(response.data.message);
        return Promise.reject('error');
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance;