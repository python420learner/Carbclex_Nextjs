export async function POST(req) {
    const body = await req.json();

    // Forward to backend Spring Boot API
    const backendRes = await fetch('/api/activity/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
}