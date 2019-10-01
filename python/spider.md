# python爬虫
## requests库
### get请求
```
response = requests.get(url, **kwargs)
# 请求头
{
        'method': 'GET',
        'authority': 'search.jd.com',
        'scheme': 'https',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6',
        'cache-control': 'no-cache',
        'path': '/Search?keyword=%E6%89%8B%E6%9C%BA&enc=utf-8',
        'cookie': '__jdu=15457205911261324468888; ip_local={ip_local}',
        'pragma': 'no-cache',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko)'
                      ' Chrome/69.0.3497.100 Safari/537.36',
 }
 # 修改代理
{}['user-agent'] = TODO
# 获取ip列表
ip_list = XunProxy().get_ip_port_list()    
# 发生请求 
response = requests.get(url, **{
    'headers': headers,
    'proxies': random.choice(ip_list),   # 设置ip
    'allow_redirects': False,   # 禁止重定向
    'timeout': 10   # 超时
}
# 状态
response.status_code == 200
# 结果编码
response.encoding = 'utf-8'
# 请求结果
response_text = response.text
```
https://blog.csdn.net/Odyssues_lee/article/details/80896033
## xpath语法
### 选取节点
| 表达式| 描述|
|:-----:|----------------------|
|nodename| 选取此节点的所有子节点 |
|/|根节点选取|
|//|从配置选择的当前节点选择文档中的节点，而不考虑位置|
|.|选取当前节点|
|..|选取当前节点的父亲节点|
|@|选取属性|

|yu|
