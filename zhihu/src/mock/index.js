import * as Mock from 'mockjs';

Mock.mock(/articles/, 'get', {
    'data|5': [{
        id: '@guid',
        title: 'title',
        text: 'hello world',
    }]
});