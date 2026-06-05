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

export type StripeRedirectResult =
  | { ok: true; url: string }
  | { ok: false; message: string; code?: string };

function readStripeError(error: any, fallback: string): StripeRedirectResult {
  const status = error?.response?.status;
  const responseData = error?.response?.data;
  const code = responseData?.error?.code ?? responseData?.code;
  const serverMessage =
    responseData?.error?.userMessage ??
    responseData?.error?.message ??
    responseData?.message;

  if (status === 401) {
    return { ok: false, code, message: 'Please log in before managing subscriptions.' };
  }

  if (status === 403) {
    return { ok: false, code, message: 'Only owner/admin accounts can manage this subscription.' };
  }

  return {
    ok: false,
    code,
    message: serverMessage || error?.message || fallback,
  };
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutSessionInput,
): Promise<StripeRedirectResult> {
  try {
    const res = await apiClient.post('/stripe/create-checkout-session', input);
    const checkoutUrl = res.data?.data?.checkoutUrl;

    if (!checkoutUrl) {
      return { ok: false, message: 'Stripe checkout URL was not returned by the server.' };
    }

    return { ok: true, url: checkoutUrl };
  } catch (error: any) {
    return readStripeError(error, 'Unable to start Stripe checkout. Please try again.');
  }
}

export async function createSubscriptionCheckoutSession(subId: string): Promise<StripeRedirectResult> {
  try {
    const res = await apiClient.post('/stripe/create-subscription-checkout-session', { subId });
    const checkoutUrl = res.data?.data?.checkoutUrl;

    if (!checkoutUrl) {
      return { ok: false, message: 'Stripe checkout URL was not returned by the server.' };
    }

    return { ok: true, url: checkoutUrl };
  } catch (error: any) {
    return readStripeError(error, 'Unable to start subscription checkout. Please try again.');
  }
}

export async function createBillingPortalSession(): Promise<StripeRedirectResult> {
  try {
    const res = await apiClient.post('/stripe/create-billing-portal-session');
    const portalUrl = res.data?.data?.portalUrl;

    if (!portalUrl) {
      return { ok: false, message: 'Stripe Billing Portal URL was not returned by the server.' };
    }

    return { ok: true, url: portalUrl };
  } catch (error: any) {
    return readStripeError(error, 'Unable to open Stripe Billing Portal. Please try again.');
  }
}
