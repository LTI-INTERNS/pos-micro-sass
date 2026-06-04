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
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    if (status === 401) {
      return {
        ok: false,
        message: 'Please log in as an owner before starting Stripe checkout.',
      };
    }

    if (status === 403) {
      return {
        ok: false,
        message: 'Only owner accounts can create a Stripe checkout session.',
      };
    }

    return {
      ok: false,
      message:
        serverMessage ||
        error?.message ||
        'Unable to start Stripe checkout. Please try again.',
    };
  }
}
