import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    // Forward the login to your real Express backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json({ ok: false, message: data.message || 'Login failed' }, { status: 401 });
    }

    // Store token in a cookie so middleware can protect routes
    const response = NextResponse.json(data);
    response.cookies.set('pos-token', data.token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
}