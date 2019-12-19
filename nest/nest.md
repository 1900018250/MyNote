## 安装

```javascript
npm i -g @nestjs/cli
nest new project-name
```
|                   |                                                              |
| :---------------- | ------------------------------------------------------------ |
| app.controller.ts | 带有单个路由的基本控制器示例。                               |
| app.module.ts     | 应用程序的根模块。                                           |
| main.ts           | 应用程序入口文件。它使用 `NestFactory` 用来创建 Nest 应用实例。 |

## 控制器
![Controllers_1](C:\Users\FX_XXXXX\Desktop\MyNote\nest\Controllers_1.png)

使用cli创建
```typescript
nest g controller cats
```

| `@Request()`              | `req`                               |
| ------------------------- | ----------------------------------- |
| `@Response()`             | `res`                               |
| `@Next()`                 | `next`                              |
| `@Session()`              | `req.session`                       |
| `@Param(key?: string)`    | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`     | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`    | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)` | `req.headers` / `req.headers[name]` |

```typescript
import { Res, HttpStatus, Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
     res.status(HttpStatus.OK).json([]);
  }
    
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

## 提供者

service repository factory helper等都可以视为Nest的提供者
都可以通过 `constructor` **注入**依赖关系
提供者只是一个用 `@Injectable()`装饰器注释的类
![Components_1](C:\Users\FX_XXXXX\Desktop\MyNote\nest\Components_1.png)

### 服务

CLI使用 nest g service cats 创建
cat.service.ts

```typescript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface'

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

cat.interface.ts

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

## 模块

模块是具有@Module() 装饰器的类 装饰器提供了元数据，Nest 用它来组织应用程序结构。

![Modules_1](C:\Users\FX_XXXXX\Desktop\MyNote\nest\Modules_1.png)

| providers   | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| ----------- | ---------------------------------------------------------- |
| controllers | 必须创建的一组控制器                                       |
| imports     | 导入模块的列表，这些模块导出了此模块中所需提供者           |
| exports     | 由本模块提供并应在其他模块中可用的提供者的子集。           |

cat.module.ts

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],	// 模块导入
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 共享模块导出

```typescript
import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
@Module({
  exports: [CatsService]
})
export class CatsModule {}
```

这样每个导入了这个模块的模块都可以访问CatsService实列

### 依赖注入

提供者也可以注入到模块(类)中（例如，用于配置目的）：但是，由于[循环依赖](https://docs.nestjs.cn/6/fundamentals?id=circular-dependency)性，模块类不能注入到提供者中。

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private readonly catsService: CatsService) {}
}
```

### 全局模块

你可能只想提供一组随时可用的东西 - 例如：helper，数据库连接等等。这就是为什么你能够使模块成为全局模块
`@Global` 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 之后，`CatsService` 组件将无处不在，但 `CatsModule` 不会被导入。

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

### 动态模块

`Nest` 模块系统带有一个称为动态模块的功能。 它使您能够毫不费力地创建可定制的模块。 让我们来看看 `DatabaseModule`：

```typescript
// 定义
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';
@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

// 使用
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class ApplicationModule {}

// 为了导出动态模块，可以省略函数调用部分：
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class ApplicationModule {}
```

## 中间件

中间件是在路由处理程序 **之前** 调用的函数。 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 `next()` 中间件函数。 `next()` 中间件函数通常由名为 `next` 的变量表示。![Middlewares_1](C:\Users\FX_XXXXX\Desktop\MyNote\nest\Middlewares_1.png)

- 执行任何代码。

- 对请求和响应对象进行更改。

- 结束请求-响应周期。

- 调用堆栈中的下一个中间件函数。

- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 `next()` 将控制传递给下一个中间件函数。否则, 请求将被挂起。

logger.middleware.ts

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}
```

app.module.ts
```typescript
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

### 路由通配符号

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

### 函数中间件

```typescript
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
};
```

```typescript
// 多个中间件
consumer.apply(cors(),helmet(),logger).forRoutes(CatsController)
// 全局中间件
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```