# AI聊天API文档

## 基础信息
- 基础URL: `https://aichat.risingstarintl.biz`
- API使用Cloudflare的Llama 2模型
- 所有接口支持跨域访问
- 响应格式: JSON

## API接口

### 1. 发送消息给AI
- **URL**: `/chat`
- **方法**: `POST`
- **Content-Type**: `application/json`
- **请求体**:
```json
{
    "message": "你的问题或消息内容"
}
```

- **响应示例**:
```json
{
    "userMessage": {
        "id": "消息ID1",
        "role": "user",
        "content": "你的问题或消息内容",
        "timestamp": 1683123456789
    },
    "aiMessage": {
        "id": "消息ID2",
        "role": "assistant",
        "content": "AI的回复内容",
        "timestamp": 1683123456790
    }
}
```

### 2. 获取聊天历史
- **URL**: `/chat/history`
- **方法**: `GET`
- **响应示例**:
```json
[
    {
        "id": "消息ID1",
        "role": "user",
        "content": "你好",
        "timestamp": 1683123456789
    },
    {
        "id": "消息ID2",
        "role": "assistant",
        "content": "你好！我是AI助手，有什么我可以帮你的吗？",
        "timestamp": 1683123456790
    }
]
```

## 调用示例

### 1. 发送消息给AI
```javascript
fetch('https://aichat.risingstarintl.biz/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: '你好，请介绍一下你自己'
    })
})
.then(response => response.json())
.then(data => {
    console.log('用户消息:', data.userMessage);
    console.log('AI回复:', data.aiMessage);
});
```

### 2. 获取聊天历史
```javascript
fetch('https://aichat.risingstarintl.biz/chat/history')
    .then(response => response.json())
    .then(messages => console.log('聊天历史:', messages));
```

## 数据结构说明

### ChatMessage
消息对象的数据结构：
```typescript
interface ChatMessage {
    id: string;        // 消息唯一标识符（UUID）
    role: string;      // 消息角色：'user' 或 'assistant'
    content: string;   // 消息内容
    timestamp: number; // 消息时间戳（毫秒）
}
```

## 注意事项
1. 所有请求都需要设置 `Content-Type: application/json` 头
2. 时间戳使用毫秒级的Unix时间戳
3. 消息ID是自动生成的UUID格式字符串
4. 消息历史按时间顺序返回
5. `role` 字段说明：
   - `user`: 用户发送的消息
   - `assistant`: AI助手的回复
6. API使用的是Cloudflare的Llama 2模型（@cf/meta/llama-2-7b-chat-int8）
7. 所有接口都支持跨域访问（CORS）
