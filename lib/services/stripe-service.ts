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

export type StripeSubscriptionChangeResult =
  | { ok: true; action: 'checkout'; url: string; message?: string }
  | { ok: true; action: 'updated' | 'scheduled' | 'cancelled_scheduled_change'; message: string }
  | { ok: false; message: string; code?: string };

export type StripeCancelScheduledChangeResult =
  | { ok: true; action: 'cancelled_scheduled_change'; message: string }
  | { ok: false; message: string; code?: string };

interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: {
      error?: {
        code?: string;
        userMessage?: string;
        message?: string;
      };
      code?: string;
      message?: string;
    };
  };
  message?: string;
}

function readStripeError(error: unknown, fallback: string): { ok: false; message: string; code?: string } {
  const err = error as AxiosErrorLike | null | undefined;
  const status = err?.response?.status;
  const responseData = err?.response?.data;
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


  if (status === 409) {
    return { ok: false, code, message: serverMessage || 'Another subscription change is already being processed. Please wait a few seconds and refresh.' };
  }

  return {
    ok: false,
    code,
    message: serverMessage || err?.message || fallback,
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    return readStripeError(error, 'Unable to start subscription checkout. Please try again.');
  }
}

export async function changeSubscriptionPlan(subId: string): Promise<StripeSubscriptionChangeResult> {
  try {
    const res = await apiClient.post('/stripe/change-subscription-plan', { subId });
    const data = res.data?.data;

    if (data?.action === 'checkout' && data?.checkoutUrl) {
      return { ok: true, action: 'checkout', url: data.checkoutUrl, message: data.message };
    }

    if (data?.action === 'updated' || data?.action === 'scheduled' || data?.action === 'cancelled_scheduled_change') {
      return { ok: true, action: data.action, message: data.message || 'Subscription change completed.' };
    }

    return { ok: false, message: 'Subscription change response was not returned by the server.' };
  } catch (error: unknown) {
    return readStripeError(error, 'Unable to change subscription. Please try again.');
  }
}

export async function cancelScheduledSubscriptionChange(): Promise<StripeCancelScheduledChangeResult> {
  try {
    const res = await apiClient.post('/stripe/cancel-scheduled-subscription-change');
    const data = res.data?.data;

    if (data?.action === 'cancelled_scheduled_change') {
      return { ok: true, action: data.action, message: data.message || 'Scheduled subscription change was cancelled.' };
    }

    return { ok: false, message: 'Cancel scheduled change response was not returned by the server.' };
  } catch (error: unknown) {
    return readStripeError(error, 'Unable to cancel scheduled change. Please try again.');
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
  } catch (error: unknown) {
    return readStripeError(error, 'Unable to open Stripe Billing Portal. Please try again.');
  }
}
