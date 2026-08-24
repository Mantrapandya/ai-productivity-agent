export interface SampleScenario {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  text: string;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'benchmark-ops',
    title: 'Daily Operations & Meeting Update',
    category: 'Operations & Management',
    badge: 'Benchmark Test',
    description: 'Packaging shortage, Rahul inventory report, Priya sales review, client proposal, marketing blocker',
    text: `Daily operations update:

The warehouse is running low on packaging material and may need a new order soon.

Rahul will prepare the updated inventory report by Friday.

Priya needs to review the latest sales numbers before the Monday team meeting.

The client requested the revised proposal before Thursday.

The marketing team is waiting for the product images from the design team.

The operations manager asked the team to identify any urgent issues before tomorrow morning.`,
  },
  {
    id: 'default-ops',
    title: 'Team Meeting & Warehouse Sync',
    category: 'Operations & Sales',
    badge: 'Standard Demo',
    description: 'Rahul, Priya, packaging supplies, proposal deadline, marketing/design dependency',
    text: `Team meeting update:
Rahul needs to complete the inventory report by Friday.
Priya will review the latest sales numbers.
The warehouse is running low on packaging material.
The client requested the revised proposal before Thursday.
The marketing team is waiting for product images from the design team.`,
  },
  {
    id: 'manufacturing-shift',
    title: 'Manufacturing Shift Handover',
    category: 'Factory / Production',
    badge: 'Shift Report',
    description: 'Line 3 recalibration, raw material delay, QA clearance on Batch #409',
    text: `Shift Handover Report - Line Operations:
Night shift achieved 920 units out of 1000 target.
Line 3 extruder temperature fluctuation flagged by Marco; maintenance must recalibrate sensors before 11 AM today.
Supplier B delayed shipment of Grade-A polymer beads, currently 3 hours late.
Batch #409 passed initial visual check but requires final QA chemical signoff from Dr. Henderson by 3 PM.
Forklift #2 scheduled for routine hydraulic oil change at 4 PM.`,
  },
  {
    id: 'tech-launch-emergency',
    title: 'Product Release Standup',
    category: 'Software Engineering',
    badge: 'Sprint Standup',
    description: 'High staging latency, API documentation, App Store review blocker, QA signoff',
    text: `Release sync for v2.4 launch:
Staging environment is experiencing 450ms latency spikes; DevOps must patch the database indexing before tomorrow's 2 PM stakeholder demo.
Sarah is finalizing the public API documentation.
iOS submission is blocked waiting on App Store Review clarification regarding privacy manifests.
QA team has completed 85% of test suites; remaining regression tests pending David's authorization by 5 PM.
Customer support team requested updated release notes draft.`,
  },
  {
    id: 'retail-store-ops',
    title: 'Retail Branch Daily Operations',
    category: 'Retail & Store Mgmt',
    badge: 'Daily Work Log',
    description: 'POS terminal failure, promotional banners, cash reconciliation deadline',
    text: `Daily Store Log - Downtown Branch:
POS Terminal 2 crashed during morning rush; IT support ticket #8812 opened, technician arriving at 1:30 PM.
Maya will conduct end-of-day register cash reconciliation by 6:00 PM closing.
Weekend promotional banners arrived damaged from courier; replacement banners need to be re-ordered immediately from print vendor.
Floor inventory audit for electronics aisle assigned to Carlos.
Air conditioning unit in stockroom making grinding noise.`,
  },
  {
    id: 'client-escalation',
    title: 'Client Service Escalation',
    category: 'Client Services',
    badge: 'Account Review',
    description: 'SLA negotiation before Wednesday, technical architecture sync, billing dispute',
    text: `Account Status - Apex Global Partnership:
Apex Global requested renegotiated SLA metrics before Wednesday end-of-day.
David needs to organize an urgent technical architecture review meeting with their VP of Engineering.
Finance department must rectify billing discrepancy on Invoice #INV-9021 before Friday processing.
Security compliance audit questionnaire received with a mandatory 5-business-day turnaround.
Customer success team waiting for updated training guides from onboarding team.`,
  },
];
