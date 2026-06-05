import { apiClient } from '@/lib/api-client';
import type { SubscriptionType } from '@/types/subscription.types';

export interface CreateStripeCheckoutSessionInput {
  companyName: string;
  address: string;
  contactNumber: string;
  email: string;
  logoUrl: string;
  businessTypeId: string;
  subId: string;
}

export type RedirectResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

export type CreateStripeCheckoutSessionResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; message: string };

function subscriptionTypeToSubId(subType: SubscriptionType): string {
  return `SUB_${subType}`;
}

function toUserMessage(error: any, fallback: string): string {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  if (status === 401) return 'Please log in as an owner before starting Stripe checkout.';
  if (status === 403) return 'Only owner accounts can manage this subscription.';

  return serverMessage || error?.message || fallback;
}

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
      message: toUserMessage(error, 'Unable to start Stripe checkout. Please try again.'),
    };
  }
}

export async function createSubscriptionCheckoutSession(
  subType: SubscriptionType,
): Promise<RedirectResult> {
  try {
    const res = await apiClient.post('/stripe/create-subscription-checkout-session', {
      subId: subscriptionTypeToSubId(subType),
    });
    const url = res.data?.data?.checkoutUrl;

    if (!url) return { ok: false, message: 'Stripe checkout URL was not returned by the server.' };
    return { ok: true, url };
  } catch (error: any) {
    return {
      ok: false,
      message: toUserMessage(error, 'Unable to start subscription checkout. Please try again.'),
    };
  }
}

export async function createBillingPortalSession(): Promise<RedirectResult> {
  try {
    const res = await apiClient.post('/stripe/create-billing-portal-session');
    const url = res.data?.data?.portalUrl;

    if (!url) return { ok: false, message: 'Stripe billing portal URL was not returned by the server.' };
    return { ok: true, url };
  } catch (error: any) {
    return {
      ok: false,
      message: toUserMessage(error, 'Unable to open the Stripe billing portal. Please try again.'),
    };
  }
}
