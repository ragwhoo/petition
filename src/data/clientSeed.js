// Client-safe seed used only for offline/localStorage fallback display.
// No seeded petitions or signatures exist by design (clean slate). Raw USNs
// and student names are intentionally NOT included here — the API masks USNs
// for the public wall and no fictional signers are shipped in the client bundle.
export const clientSeed = [
  {
    id: "rrce-gown-fee",
    slug: "rrce-gown-fee-representation",
    title: "Representation Regarding the ₹1,000 Convocation Gown Fee and Clarity on Alumni Association Fees",
    college: "RajaRajeswari College of Engineering (RRCE), Bengaluru",
    targetSignatures: 500,
    createdAt: "2026-09-01T10:00:00.000Z",
    signatures: []
  }
];