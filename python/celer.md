# celer+django配置和使用
## 配置

<https://segmentfault.com/a/1190000008022050>

### 环境
```
pip 安装：
    celery
    django-celery
    django-celery-beat
    django-celery-results
    redis
```
### redis
```
安装redis
brew install redis

开启redis
redis-server
```

### django setting文件
```
app中添加
'django_celery_results',


# celery配置
CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'  # Broker配置，使用Redis作为消息中间件
CELERY_RESULT_BACKEND = 'django-db'  # BACKEND配置，这里使用redis
CELERY_RESULT_EXPIRES = 60 * 5 * 1  # 结果有效期
CELERY_RESULT_SERIALIZER = 'json'   # 结果序列化方案
CELERY_TASK_SERIALIZER = 'json'     # 配置序列化任务载荷的默认的序列化方式
CELERY_TIMEZONE = 'Asia/Shanghai'
CELERY_IGNORE_RESULT = False       # 故障相关
CELERY_TASK_TRACK_STARTED = True        # TODO 未知 任务跟踪开始
# CELERY_QUEUES	Celery队列设定
# CELERY_ROUTES	Celery路由设定，用于给不同的任务指派不同的队列
# CELERYBEAT_SCHEDULE	Celery计划任务设定
```
### celery 设置
```
在项目setting文件所在的文件夹新建
celery.py

from __future__ import absolute_import, unicode_literals # 重要不然import会出问题
import os
from datetime import timedelta

from celery import Celery, platforms
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jingdong.settings')

app = Celery('jingdong')

app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
# 启动命令
# celery worker -A jingdong -l debug


在此目录的__init__.py中添加
__init__.py

from __future__ import absolute_import
# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery import app as celery_app
__all__ = ['celery_app']


之后要引入celery的时候
from __future__ import absolute_import, unicode_literals # 这是必须的
from jingdong import celery_app
```

## celery使用
## 定义任务和异步调用
```
from jingdong import celery_app
from __future__ import absolute_import, unicode_literals
import time

@celery_app.task()
def test():
    time.sleep(2)
    return 1

test.delay()    # 异步调用
```
## 常用方法
```
# 之后使用add函数演示
@celery_app.task()
def add(a, b):
    return a + b
```
### .s()
返回一个函数
```
# 这里是意思相当于 
let twoAddtwo: (number, number) => number  = function(a=2: number, b=2: number): number {
    return a + b
}
就是返回一个已经有参数的函数
twoAddtwo = add.s(2, 2)
twoAddtwo.delay() # 4
res = twoAddtwo.delay()
res.get()   # d
res # task id
```
### group
调用一系列的异步任务
```
res = group(add.s(i, i) for i in [1, 2, 3, 4, 5])()
res.get()   # [2, 4, 6, 8, 10]
# 此后后台可以看到运行了5个异步任务
```
### chain  
任务可以被链接的 也就是一个任务完成后，把结果返回给另一个任务
```
res = chain(add.s(4,4), mul.s(8))()
res.get()   # 64
res #只有一个任务 但是后台是先异步调用了add 把add结果传如mul
```

## 队列
celery 通过都默认的queue队列来存放任务
如果考虑到每个任务到执行时间，重要度应该分开
把task1放到queue1中 指定worker1处理queue1
把task2放到queue2中 指定worker2处理queue2
```
 # 队列
CELERY_QUEUES={
    Queue('default', exchange=Exchange('default'), routing_key='default'),
    Queue('app_task1', exchange=Exchange('app_task1'), routing_key='app_task1'),
    Queue('app_task2', exchange=Exchange('app_task2'), routing_key='app_task2'),
},
# 队列路由
CELERY_ROUTES={
    'jd_shop.tasks.add': {'queue': 'app_task1', 'routing_key': 'app_task1'},
    'jd_shop.tasks.mull': {'queue': 'app_task2', 'routing_key': 'app_task2'}
}
```
celery worker -A jingdong -l debug
celery -A jingdong worker -l info -Q app_task1
celery -A jingdong worker -l info -Q app_task2


## 定时器
```
CELERYBEAT_SCHEDULE = {
    'celery_app.task.task1': {
        'task': 'celery_app.task.task1',
        'schedule': timedelta(seconds=20),
        'args': (1, 10)
    },
    'celery_app.task.task2': {
        'task': 'celery_app.task.task2',
        'schedule': crontab(minute='*/2'),
        'args': ()
    }
}
```
启动定时器:
CELERY -A celery_app beat

## 状态
PENDING	任务等待中
STARTED	任务已开始
SUCCESS	任务执行成功
FAILURE	任务执行失败
RETRY	任务将被重试
REVOKED	任务取消

## 任务状态监控
```
@celery_task(bind=True)
def po1(self):
    for i in range(1, 100):
        time.sleep(2)
        self.update_state(state='PROCESS', meta={'process': i, 'source': 'po1'})
    return {'success': 2}
```
监控函数
```
def pm(body):
    res = body.get('result')
    if body.get('status') == 'PROGRESS':
        print('\r任务进度: {0}%'.format(res.get('p')))
    else:
        print('\r')
        print(res)
```
绑定监控
```
r = po1.delay()
r.get(on_message=pm, propagate=False)
```
group监控
```
@celery_app.task(bind=True)
def po_group(self):
    task_list = group([
        po1.s(), po2.s(), po3.s()
    ])()
    return task_list

a = po_group.delay()
a.get()[1][0][0][0]
'e4eea2bc-1871-4bc2-a461-24a87ac46362'
a.get()[1][1][0][0]
'0018905e-4a19-4dc2-8167-7bb70a05275b'
a.get()[1][2][0][0]
'8d55a17f-b5f3-48ac-acf4-ee307ff4c5b4'
import celery.result import AsyncResult
po1_r = AsyncResult(a.get()[1][0][0][0])    # 可能不是1
```