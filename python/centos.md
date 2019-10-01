# centos

## 查看版本

cat /etc/redhat-release

### 修改pip源

mkdir ~/.pip 
vim ~/.pip/pip.conf
[global]
index-url = http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host = mirrors.aliyun.com

### 安装python和虚拟环境

```
$ pip3 install --upgrade pip
```

```
$ pip3 install virtualenv
$ pip3 install virtualenvwrapper
```


找到virtualenv

find / -name virtualenvwrapper.sh
如果不在/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin里

将virtualenvwrapper.sh复制到/usr/local/bin/virtualenv

使用vim编辑`.bashrc`文件

```
$ vim ~/.bashrc
```

在文末填入以下代码并保存

```
VIRTUALENVWRAPPER_PYTHON=/usr/local/python3/bin/python3    # 指定virtualenvwrapper执行的python版本
export WORKON_HOME=$HOME/.virtualenvs    # 指定虚拟环境存放目录，.virtualenvs目录名可自拟
source /usr/local/bin/virtualenvwrapper.sh    # virtualenvwrapper.sh所在目录
```


--------------------- 