---
trigger: always_on
---

# Domain Rules

## Purpose

This file defines rules for Admin-domain screens, navigation, and operational workflows.

It does not replace:

- backend business logic;
- API contracts;
- database rules;
- project-wide coding rules.

For detailed screen definitions and wireframe flows, use:

```txt
docs/wireframe_guide.md
```

Read only the relevant section for the current task.

## Core Domain Flow

The primary operational flow is:

```txt
Owner
→ Pet
→ Appointment
→ Service Execution
→ Service Record
→ Invoice
→ Payment
```

Vaccination-specific flow:

```txt
Pet
→ Vaccine Plan
→ Appointment
→ Vaccination Record
→ Vaccine Lot
→ Next Vaccine Plan
→ Invoice
→ Payment
→ Reminder
```

Appointment is the main orchestration entity for service execution.

Do not implement service workflows as isolated CRUD flows when they belong to an Appointment-driven process.

## Main Admin Modules

The Admin application includes these major modules:

- Dashboard
- Appointment Management
- Customer & Pet Management
- Vaccination Management
- Inventory & Service Catalog
- Staff & Veterinarian Management
- Marketing & Voucher Management
- Finance
- Notifications
- Settings

The detailed screen list and navigation map are defined in:

```txt
docs/ADMIN_WIREFRAME_AGENT_GUIDE.md
```

## Before Implementing an Admin Screen

Before coding:

1. Identify the relevant module.
2. Read the related section in `docs/ADMIN_WIREFRAME_AGENT_GUIDE.md`.
3. Identify how the user enters the screen.
4. Identify the screen's main purpose.
5. Identify available actions and navigation destinations.
6. Inspect existing routes.
7. Inspect related Pinia stores.
8. Inspect related API services.
9. Inspect existing domain types and enums.
10. Inspect reusable components.
11. Confirm the backend API supports the intended action.

Do not implement a screen as an isolated CRUD page when it belongs to a documented workflow.

## Navigation Rules

Use dedicated routes for:

- entity detail pages;
- complex operational workflows;
- screens users may bookmark or revisit;
- screens with substantial state or multiple tabs.

Examples:

```txt
/appointments
/appointments/:id

/owners
/owners/:id

/pets
/pets/:id

/invoices
/invoices/:id
```

Use Drawer for:

- create/edit forms;
- secondary detail information;
- contextual actions where preserving page context is useful.

Use Modal for:

- confirmations;
- destructive actions;
- short decisions;
- warnings.

Do not place a complete business workflow inside a Modal.

## Appointment Rules

Typical operational direction:

```txt
PENDING
→ RECEIVED
→ CHECKED_IN
→ SERVICE_DONE
→ COMPLETED
```

Cancellation is a separate transition and must follow backend-supported rules.

The frontend must not:

- invent unsupported state transitions;
- assume a transition succeeded before backend confirmation;
- complete an Appointment before required service records are confirmed.

Actions unavailable in the current state should be hidden or disabled clearly.

## Vaccination Rules

Preferred flow:

```txt
Appointment
→ Execute Vaccination Service
→ Select Vaccine
→ Select Vaccine Lot
→ Submit Administration Data
→ Backend Creates Vaccination Record
→ Backend Updates Inventory
→ Backend Updates Vaccine Plan
→ Backend Creates Next Plan When Applicable
→ Backend Updates Invoice
→ Frontend Refreshes State
```

The frontend must not independently:

- decrement vaccine inventory;
- mark a vaccine plan complete;
- generate the next vaccine plan;
- create financial truth;
- schedule reminders.

These operations must be performed or confirmed by the backend.

## Customer and Pet Rules

Owner and Pet are major navigation anchors.

Preferred navigation:

```txt
Owner List
→ Owner Detail
→ Pet Detail
→ Appointment / Vaccine Plan / Vaccination Record
```

Operational records should navigate back to related entities when available:

- Owner
- Pet
- Appointment

Avoid dead-end detail pages.

## Inventory Rules

### Vaccine Inventory

Typical relation:

```txt
Vaccine
→ Vaccine Lot
→ Vaccination Record
```

The UI may display inventory state, but inventory mutation belongs to backend APIs.

### Microchip Inventory

Typical relation:

```txt
Microchip Batch
→ Microchip
→ Pet Assignment
```

The UI may display calculated summaries, but backend data remains the source of truth.

## Finance Rules

Typical flow:

```txt
Service Execution
→ Invoice
→ Payment
→ Backend Confirmation
→ Appointment Completion
```

The frontend must not independently determine:

- final invoice totals;
- payment success;
- refund completion;
- final balance correctness.

Financial values shown as authoritative must come from backend-confirmed data.

## Screen State Requirements

Every server-driven Admin screen should consider:

- initial loading;
- refresh loading;
- empty state;
- API error;
- pagination when applicable;
- filters when applicable;
- disabled state during mutations;
- destructive action confirmation;
- permission restrictions when applicable.

Do not silently hide API errors.

## Domain Mutation Rules

The frontend must not independently perform domain-critical mutations such as:

- vaccine inventory deduction;
- microchip assignment;
- vaccination completion;
- vaccine plan completion;
- next vaccine plan generation;
- invoice total calculation;
- payment reconciliation;
- voucher financial calculation;
- loyalty point mutation;
- reminder scheduling.

The frontend may:

- submit commands;
- display pending state;
- display backend-confirmed results;
- refresh related server state.

## Contract Mismatch Rules

If the wireframe expects behavior that the backend does not support:

- do not invent fields;
- do not invent endpoints;
- do not create fake frontend business logic;
- do not silently alter the workflow.

Report the mismatch clearly and preserve the existing backend contract.
