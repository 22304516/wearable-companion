# Privacy, ethics, and regulatory review

**Review date:** 15 October 2026  
**Status:** Project-planning review only. This is not legal advice, a compliance assessment, a TGA classification, or an ethics approval.

## Current project boundary

The current prototype generates synthetic readings and stores a bounded set of records in local app storage. No wearable hardware is connected, no real health readings or participant information have been collected for this project, no Supabase project/backend is configured, and no user study is recorded as having occurred. The app's authentication integration is code only until an owner configures a provider project. These are project facts, not a finding that a later deployment is compliant or outside a law's scope.

Do not enter real health or other sensitive personal information. Before changing that boundary, record the intended users, purpose, data fields, collection method, storage locations, recipients, retention/deletion process, and responsible organisation, then seek the appropriate university and privacy advice.

## Conditional review items

| Topic | What the project should check before expanding scope | Current status |
|---|---|---|
| Australian Privacy Principles and health information | Determine which entity would collect/hold the information, whether the Privacy Act 1988 and APPs apply, whether information is sensitive health information, and what notice, consent, access/correction, security, retention, disclosure, and breach-response arrangements are required. OAIC guidance says coverage can depend on the organisation and its activities; some health-service providers may be covered even where a small-business exemption might otherwise be relevant. | Not determined for any future deployment. The prototype has synthetic data only. |
| Victorian health-records rules | If a Victorian organisation handles health information, ask a privacy adviser whether the Health Records Act 2001 (Vic) and Health Privacy Principles apply alongside any Commonwealth requirements. Confirm the responsible regulator and the organisation's status for the actual deployment. | Not determined; no real health information is handled. |
| La Trobe human research ethics | Before recruiting people, conducting interviews/surveys/usability research, or collecting/using information about people as research, ask the supervisor and La Trobe Ethics, Integrity and Biosafety team whether approval or an exemption is required. La Trobe says required approval must be in place before research starts; an exemption must be granted, not presumed. | No participant research or ethics application is recorded. Ask the supervisor before any user study. |
| Medical-device / TGA scope | Review the app's actual intended purpose, functionality, marketing, and claims with a suitably qualified adviser. TGA guidance explains that software can be a medical device depending on intended purpose; do not imply diagnosis, treatment, clinical monitoring, or safety-critical performance without an appropriate determination and pathway. | Student demonstration app uses synthetic sample data and explicitly labels its threshold alert non-medical. No TGA determination has been made. |
| Authentication and data security | Before real accounts or data: configure a controlled development environment, define server-side authorization and tested row-level access controls, select secure native session storage, review dependency advisories, provide account/data deletion and incident handling, and verify backups/retention. A client-side account namespace is not a security boundary. | Incomplete. Supabase auth integration is unconfigured; there is no readings backend/RLS, secure session vault, or production security review. |
| Consent, transparency, and user choice | If data collection is introduced, provide a clear purpose/data notice, a justified collection scope, appropriate consent and withdrawal routes, and accessible controls. Separate research participation consent from app account terms where applicable. | Not applicable to the current synthetic-only demo; future requirements need review. |

## Before a real-data or participant-study change

1. Confirm the capstone assessment and research classification with the supervisor; contact La Trobe Ethics, Integrity and Biosafety if people or their data will be involved.
2. Map data flows and identify the legal entity/operator, hosting regions, third-party processors, access roles, and the minimum necessary fields.
3. Obtain privacy/security review of notices, consent, access/deletion, retention, breach response, secure storage, authorization, and supplier terms.
4. Confirm intended-purpose wording and obtain specialist advice on whether TGA regulation applies before making clinical or medical claims.
5. Implement the approved controls, create test cases using synthetic fixtures, and record evidence before accepting real data.

These steps are gates for future scope, not claims that the current capstone has completed them.

## Primary sources

- OAIC, [Australian Privacy Principles guidelines](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines).
- OAIC, [What is a health service provider?](https://www.oaic.gov.au/privacy/your-privacy-rights/health-information/what-is-a-health-service-provider).
- OAIC, [Handling health information](https://www.oaic.gov.au/privacy/your-privacy-rights/health-information/handling-health-information).
- OAIC, [State and territory privacy legislation](https://www.oaic.gov.au/privacy/privacy-legislation/state-and-territory-privacy-legislation).
- Victorian legislation, [Health Records Act 2001 (current in-force version)](https://www.legislation.vic.gov.au/in-force/acts/health-records-act-2001/029).
- La Trobe University, [Human Research Ethics](https://www.latrobe.edu.au/research/researcher-support/ethics%2C-biosafety-and-integrity/human-research-ethics).
- Therapeutic Goods Administration, [Understanding how we regulate software-based medical devices](https://www.tga.gov.au/resources/guidance/understanding-how-we-regulate-software-based-medical-devices).

## Review triggers

Revisit this document before real data, accounts, external hosting, participant testing, clinical claims, a hardware integration, or a public release. Record the date, reviewer/role, scope considered, advice received, and resulting decisions; do not record approval unless documented.
