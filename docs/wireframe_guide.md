# Admin Wireframe Guide (PVMS)

This document serves as the ultimate frontend source of truth for screen layout, navigation, and module responsibilities in the Pet Vaccination Management System (PVMS) Admin interface. 

> [!IMPORTANT]
> **Implementation Rule**
> This wireframe describes the UI and UX flow. It is **not** the backend source of truth. If the backend API contract conflicts with this guide, **always preserve the backend contract** and report the mismatch. Do not implement frontend-only workarounds.

---

## 1. Global Layout & Navigation

### App Shell
The application follows a standard, compact admin dashboard layout:
- **Sidebar (Left)**: Contains the main navigation menu grouping modules. It should be collapsible.
- **Header (Top)**: Contains global search, notification bell, language switcher (i18n), and user profile dropdown (Settings, Logout).
- **Breadcrumbs**: Displayed immediately below the header to indicate current hierarchy (e.g., `Home / Customers / John Doe / Fluffy`).
- **Content Area**: The main scrollable area for module content.

### UI Component Rules
To maintain consistency and preserve context during workflows, adhere to these rendering rules:
- **Pages (Routes)**: Use dedicated routes (`/owners/:id`) for complex entities, operational workflows, and screens with multiple tabs.
- **Drawers**: Use right-side Drawers for Create/Edit forms to preserve the underlying list view context.
- **Modals**: Use Modals strictly for short confirmations, warnings, or destructive actions (e.g., "Are you sure you want to cancel this appointment?").

---

## 2. Core Modules Wireframes

### 2.1. Dashboard
- **Route**: `/` or `/dashboard`
- **Layout**: Grid layout with summary widgets.
- **Content**:
  - Key Metrics: Total Revenue, Appointments Today, New Customers.
  - Quick Actions: "New Appointment", "Register Customer".
  - Alert Tables: "Vaccines Expiring Soon", "Low Inventory", "Pets due for vaccination".

### 2.2. Customer & Pet Management
- **Route**: `/owners`, `/pets`
- **Owner List Screen**:
  - Table: Name, Phone, Email, Number of Pets, Actions.
  - Filters: Search by name/phone.
- **Owner Detail Screen (`/owners/:id`)**:
  - Layout: Left profile card (Owner info), Right tabbed panel.
  - Tabs: **Pets** (List of pets owned), **Appointments** (History), **Invoices**.
- **Pet Detail Screen (`/pets/:id`)**:
  - Layout: Left profile card (Pet info, breed, age), Right tabbed panel.
  - Tabs: 
    - **Vaccination Records**: History of administered vaccines.
    - **Vaccine Plans**: Current active plans and next due dates.
    - **Appointments**: History of visits.

### 2.3. Appointment Management
- **Route**: `/appointments`
- **List Screen (Kanban Board)**:
  - Layout: A horizontal drag-and-drop Kanban board representing the operational flow.
  - Columns (States): `PENDING` -> `RECEIVED` -> `CHECKED_IN` -> `SERVICE_DONE` -> `COMPLETED`.
  - Cards: Display Pet Name, Owner Name, Time, Service Type.
  - Interaction: Dragging a card triggers a state transition API call. Forms may pop up (via Drawer/Modal) if a transition requires additional data (e.g., assigning a vet when moving to `RECEIVED`).
- **Appointment Detail (`/appointments/:id`)**:
  - Layout: Full page workflow.
  - Content: Contextual service execution. If it's a vaccination appointment, it provides the UI to select a Vaccine Lot and record the administration.

### 2.4. Vaccination Management
- **Route**: `/vaccinations/plans`
- **Vaccine Plan List**:
  - Table: Pet Name, Plan Type, Start Date, Next Due Date, Status (Active/Completed).
  - Purpose: Tracks the long-term vaccination schedule for pets.

### 2.5. Inventory & Service Catalog
- **Route**: `/inventory/vaccines`, `/inventory/services`
- **Vaccine Catalog List**:
  - Table: Vaccine Name, Manufacturer, Total Stock.
- **Vaccine Detail / Lots**:
  - Detail page showing specific batches (Lots) for a vaccine, including Expiry Dates and specific Lot quantities.
- **Services List**:
  - Table: Service Name, Base Price, Category.

### 2.6. Finance
- **Route**: `/finance/invoices`
- **Invoice List**:
  - Table: Invoice ID, Date, Owner Name, Total Amount, Status (Draft, Unpaid, Paid).
- **Invoice Detail (`/finance/invoices/:id`)**:
  - Layout: Standard invoice view.
  - Content: Line items (services, products), subtotal, tax, total.
  - Actions: "Process Payment" (triggers Payment modal/drawer).

---

## 3. Cross-Module Workflows

The frontend must support seamless navigation between entities, especially for core operational flows. Avoid "dead-end" detail pages.

### 3.1. The Vaccination Operational Flow
This is the most critical flow in the system. The UI must guide the user without inventing state.
1. **Start**: User clicks an appointment card in the **Kanban Board** (`CHECKED_IN` state) and opens the Appointment Detail page.
2. **Execute Service**: User navigates to the Vaccination section within the appointment.
3. **Select Resources**: User selects the administered `Vaccine` and specific `Vaccine Lot`.
4. **Submit Data**: User clicks "Save Record".
5. **Backend Responsibility**: 
   - *Backend* creates the Vaccination Record.
   - *Backend* deducts Vaccine Inventory.
   - *Backend* updates the Vaccine Plan.
   - *Backend* adds line items to the Invoice.
6. **Frontend Resolution**: Upon successful API response, the frontend refreshes the Appointment state, automatically moving it to `SERVICE_DONE` (if dictated by backend) and showing the updated Invoice totals for payment.

### 3.2. Customer Navigation Anchor
Records should always trace back to the customer.
- Clicking an Owner name in an Invoice redirects to `Owner Detail`.
- Clicking a Pet name in the Kanban board redirects to `Pet Detail`.
- From `Pet Detail`, users can easily click "Schedule Appointment", which pre-fills the Pet and Owner IDs in the Appointment Drawer.
