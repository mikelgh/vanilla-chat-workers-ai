addEventListener('fetch', event => {  
    event.respondWith(handleRequest(event.request));  
});  

async function handleRequest(request: Request): Promise<Response> {  
    const url = new URL(request.url);  
    if (url.pathname === '/register' && request.method === 'POST') {  
        const { username, password } = await request.json();  
        await registerUser(username, password);  
        return new Response('User registered', { status: 200 });  
    } else if (url.pathname === '/login' && request.method === 'POST') {  
        const { username, password } = await request.json();  
        const isValid = await loginUser(username, password);  
        if (isValid) {  
            return new Response(JSON.stringify({ username }), { status: 200 });  
        } else {  
            return new Response('Invalid credentials', { status: 401 });  
        }  
    }  
    return new Response('Not found', { status: 404 });  
}  

async function registerUser(username: string, password: string) {  
    const hashedPassword = await hashPassword(password);  
    await USERS.put(username, hashedPassword);  
}  

async function loginUser(username: string, password: string): Promise<boolean> {  
    const storedPassword = await USERS.get(username);  
    return storedPassword && await verifyPassword(password, storedPassword);  
}  