addEventListener('fetch', event => {  
    event.respondWith(handleRequest(event.request));  
});  

// 定义消息类型
interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

async function handleRequest(request: Request): Promise<Response> {  
    const url = new URL(request.url);  
    
    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (url.pathname === '/chat' && request.method === 'POST') {
        const { message } = await request.json();
        
        // 创建用户消息
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: message,
            timestamp: Date.now()
        };
        
        // 存储用户消息
        await MESSAGES.put(userMessage.id, JSON.stringify(userMessage));
        
        // 获取AI回复
        const aiResponse = await AI.run('@cf/meta/llama-2-7b-chat-int8', {
            messages: [{ role: 'user', content: message }]
        });
        
        // 创建AI回复消息
        const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: aiResponse.response,
            timestamp: Date.now()
        };
        
        // 存储AI回复
        await MESSAGES.put(aiMessage.id, JSON.stringify(aiMessage));
        
        // 更新消息列表
        const messageList = await MESSAGES.get('messageList') || '[]';
        const messages = JSON.parse(messageList);
        messages.push(userMessage.id, aiMessage.id);
        await MESSAGES.put('messageList', JSON.stringify(messages));
        
        return new Response(JSON.stringify({
            userMessage,
            aiMessage
        }), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    } else if (url.pathname === '/chat/history' && request.method === 'GET') {
        const messageList = await MESSAGES.get('messageList') || '[]';
        const messageIds = JSON.parse(messageList);
        
        // 获取所有消息详情
        const messages = await Promise.all(
            messageIds.map(async (id: string) => {
                const messageStr = await MESSAGES.get(id);
                return messageStr ? JSON.parse(messageStr) : null;
            })
        );
        
        return new Response(JSON.stringify(messages.filter(Boolean)), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    }
    
    return new Response('Not found', { status: 404 });
}  