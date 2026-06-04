import { apiClient } from '@/lib/api-client';

export interface CreateStripeCheckoutSessionInput {
  companyName: string;
  address: string;
  contactNumber: string;
  email: string;
  logoUrl: string;
  businessTypeId: string;
  subId: string;
}

export type CreateStripeCheckoutSessionResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; message: string };

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutSessionInput,
): Promise<CreateStripeCheckoutSessionResult> {
  try {
    const res = await apiClient.post('/stripe/create-checkout-session', input);
    const checkoutUrl = res.data?.data?.checkoutUrl;

    if (!checkoutUrl) {
      return { ok: false, message: 'Stripe checkout URL was not returned by the server.' };
    }

    return { ok: true, checkoutUrl };
  } catch (error: any) {
    return {
      ok: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Unable to start Stripe checkout. Please try again.',
    };
  }
}
