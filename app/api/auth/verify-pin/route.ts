import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/**
 * POST /api/auth/verify-pin
 * Body: { cashierId, pin }

 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cashierId, pin } = body as { cashierId?: string; pin?: string };

        if (!cashierId || !pin) {
            return NextResponse.json(
                { success: false, error: 'cashierId and pin are required' },
                { status: 400 }
            );
        }

        const res = await fetch(`${API}/api/v1/auth/cashier-pin`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ cashierId, pin }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error:   result.message ?? 'Invalid PIN',
                    code:    result.code    ?? 'INVALID_PIN',
                },
                { status: res.status }
            );
        }

        return NextResponse.json({ success: true, data: result.data });

    } catch {
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
