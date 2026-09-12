# Phase 3C: Vercel Web Analytics baseline

## Scope

Issue #129 adds one low-maintenance analytics path for automatic pageview measurement. The root layout renders the official `Analytics` component from `@vercel/analytics/next` exactly once.

Web Analytics is enabled for the existing Vercel project `skill-mvp` on its included Hobby option. The activation did not start a Pro trial, select the paid Pro option, add a payment method, or change the team plan.

The integration is limited to Vercel Web Analytics' standard page-level reporting, including anonymized visitor, pageview, referrer, and bounce information. It does not add custom events, conversion tracking, affiliate attribution, advanced UTM processing, or another analytics provider.

## Privacy and Hobby-plan behavior

Vercel documents Web Analytics as anonymized and cookie-free. This implementation therefore introduces no analytics cookies. That statement describes the integration's technical behavior; it is not a general legal conclusion about privacy or consent obligations.

For the current Hobby plan:

- the included allowance is 50,000 events per month;
- one month of analytics retention is available;
- collection pauses instead of creating usage charges when the included limit is exceeded;
- custom events are unavailable and are not implemented in this phase.

No Pro trial, plan upgrade, paid add-on, or payment method is required by this baseline.

## Single-provider boundary

The previous Plausible path was dormant: its loader returned nothing unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` was set, the repository contained no environment file defining that variable, and no other source consumed its loader or configuration. The loader and its configuration have been removed so the application cannot load both Plausible and Vercel Analytics.

The existing local-console-only outbound event helper remains unchanged. It does not persist or transmit analytics and does not become a conversion event through this work.

## Verification

Run `corepack pnpm check:analytics-baseline` with the repository validation suite. The focused check protects the single root integration, production dependency, Plausible removal, and absence of custom-event calls.
