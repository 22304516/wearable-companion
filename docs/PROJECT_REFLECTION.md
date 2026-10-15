# Project reflection — draft for owner review

**Purpose:** A fact-grounded reflection draft for the capstone report or presentation. It is based on the supplied project prompt, the user's reported setup/Git issues, current repository evidence, and recorded validation results. Review every first-person statement against personal experience before submission; revise or remove anything that does not reflect the student's own view. This document does not invent group meetings, contributions, dates, or emotions.

## Working arrangement and scope

The project was originally intended to be completed as a group. The project owner reports that attempts were made to communicate and coordinate with the original group, then development continued independently to maintain progress. The date of that transition and the contributions of other students are not recorded here.

Working independently made scope control important. The implementation focused on a demonstrable mobile-first interface using clearly labelled synthetic readings, two simulator profiles, local history, user preferences, and a limited in-app threshold alert. No wearable, NFC tag, mobile test target, Jira board, or configured Supabase project was available. The project therefore documents BLE/NFC, live account verification, mobile testing, and production security as incomplete rather than presenting them as finished.

## What the project evidence shows worked

- Keeping the simulator explicit allowed the dashboard, history, profile selection, summaries, and alert interaction to be demonstrated without pretending that hardware was connected.
- Small, separate Git changes and current-state documentation made it possible to review code, tests, limitations, and handover material incrementally.
- Static checks and focused pure-helper tests provided repeatable evidence for logic and source quality. Web preview checks added limited evidence for visible app workflows.
- The project kept a clear boundary around health-like data: samples are synthetic, the app is not for medical decisions, and real-data use remains blocked on security and privacy work.

## Challenges recorded during development

- After the project directory was removed or moved, the shell remained in a stale working directory. `npm install` then failed because `package.json` could not be found, and Node reported that its current directory no longer existed. Creating the project in a valid location and changing into it before running npm resolved the setup path issue.
- The first GitHub push was rejected because the active GitHub identity did not have permission to the selected repository. The user reauthenticated and later confirmed that the project was pushed.
- Hardware and platform validation could not be completed with the resources available. Dependency audit findings also required care: proposed automatic fixes involved breaking Expo/React Native changes, so they were documented rather than forced.
- A web accessibility check found that radio choices changed visually without exposing selected state and Space-key behavior. That issue was corrected and checked in the local web preview; a complete accessibility audit remains outstanding.

## Lessons and improvements to consider

- Verify the repository path and current directory before installing packages or running build commands, especially after moving or recreating a project folder.
- Check the intended Git remote, account identity, and repository permissions before relying on a push as a delivery step.
- Establish hardware, provider credentials, target platforms, assessment dates, and group-form expectations early; they determine which integration and validation claims are possible.
- Keep each feature's implementation status separate from evidence of testing. A simulator, web preview, or pure-helper test cannot prove native, provider, or hardware behavior.
- If continuing the project, prioritize official assessment clarification, a controlled Supabase test project, real web file-export inspection, and validation on an available mobile target before adding optional features.

## Owner review before submission

- [ ] Confirm that the description of the independent-work transition and prior setup issues matches the student's experience.
- [ ] Add personal learning and improvement points in the student's own words.
- [ ] Add dates or examples only when supported by contemporaneous records.
- [ ] Separate any earlier group contribution from work completed independently.
- [ ] Keep unresolved hardware, account, security, and platform limitations visible.
