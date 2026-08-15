export interface Reference {
  title: string;
  statute: string;
  description: string;
}

export const REFERENCES_BY_COUNTRY: Record<string, Reference[]> = {
  MY: [
    {
      title: 'Wills Act 1959',
      statute: 'Malaysia · §5',
      description: "Formal requirements: 18+, two witnesses, signed in each other's presence.",
    },
    {
      title: 'Distribution Act 1958',
      statute: 'Malaysia · §6(1)',
      description: 'Intestate distribution rules for non-Muslims when no will exists.',
    },
    {
      title: 'Probate and Administration Act 1959',
      statute: 'Malaysia · §3',
      description: 'Who may apply for grant of probate or letters of administration.',
    },
  ],
  MY_WK: [
    {
      title: 'Wasiat Enactments (State)',
      statute: 'Malaysia · 1/3 cap',
      description: 'A Muslim may bequeath up to one-third to non-heirs; the remainder follows Faraid.',
    },
    {
      title: 'Faraid — Quranic Shares',
      statute: "Surah An-Nisā' · 4:11–12",
      description: 'Fixed inheritance shares for spouse, parents, and children under Islamic law.',
    },
    {
      title: 'Hibah (Lifetime Gift)',
      statute: 'Shariah principle',
      description: 'Lawful transfer during lifetime; sits outside Faraid distribution.',
    },
    {
      title: 'Syariah Court Jurisdiction',
      statute: "Federal Constitution · Schedule 9, List II",
      description: 'Wasiat and Faraid disputes are heard by State Syariah Courts.',
    },
  ],
  SG: [
    {
      title: 'Wills Act 1838',
      statute: 'Singapore · §6',
      description: 'Testator must be 21+, of sound mind, with two independent witnesses.',
    },
    {
      title: 'Intestate Succession Act 1967',
      statute: 'Singapore · §7',
      description: 'Statutory order of distribution where no valid will exists (non-Muslims).',
    },
    {
      title: 'Probate and Administration Act 1934',
      statute: 'Singapore · §6',
      description: 'Family Justice Courts grant probate or letters of administration.',
    },
    {
      title: 'Administration of Muslim Law Act',
      statute: 'Singapore · AMLA Part VII',
      description: 'Muslim estates follow Faraid; Syariah Court issues inheritance certificate.',
    },
  ],
  HK: [
    {
      title: 'Wills Ordinance',
      statute: 'Hong Kong · Cap. 30 §5',
      description: 'Testator 18+; two witnesses present at the same time, signing in your presence.',
    },
    {
      title: "Intestates' Estates Ordinance",
      statute: 'Hong Kong · Cap. 73 §4',
      description: "Distribution of an intestate's estate to surviving spouse, issue, and family.",
    },
    {
      title: 'Probate and Administration Ordinance',
      statute: 'Hong Kong · Cap. 10 §24',
      description: 'Procedure for obtaining a Grant of Representation in Hong Kong.',
    },
  ],
  CN: [
    {
      title: 'Civil Code — Book VI (Inheritance)',
      statute: 'PRC · Arts. 1119–1163',
      description: 'Recognises notarised, holographic, witnessed, oral, audio-visual and printed wills.',
    },
    {
      title: 'Statutory Heirs',
      statute: 'PRC · Art. 1127',
      description: 'First-order heirs: spouse, children, parents. Second-order: siblings, grandparents.',
    },
    {
      title: 'Notarization Law',
      statute: 'PRC · 2005',
      description: 'Procedure and effect of a notarised will (公证遗嘱).',
    },
  ],
  TW: [
    {
      title: 'Civil Code — Book V',
      statute: 'Taiwan · Arts. 1138, 1189',
      description: 'Five permitted will forms: holographic, notarial, secret, dictated, oral.',
    },
    {
      title: 'Compulsory Portion (特留分)',
      statute: 'Taiwan · Art. 1223',
      description: 'A reserved share that cannot be removed by will from close family.',
    },
    {
      title: 'Inheritance and Gift Tax Act',
      statute: 'Taiwan · 2017 amended',
      description: 'Progressive 10–20% rate on estate value above the exemption threshold.',
    },
  ],
  ID: [
    {
      title: 'KUHPerdata (Civil Code)',
      statute: 'Indonesia · Arts. 874–1130',
      description: 'Notarial, closed (sealed), and holographic wills for non-Muslim estates.',
    },
    {
      title: 'Notary Law (UU 2/2014)',
      statute: 'Indonesia · UU 2/2014',
      description: 'A notary draws up the akta wasiat with two witnesses present.',
    },
    {
      title: 'Compilation of Islamic Law (KHI)',
      statute: 'Indonesia · Buku II',
      description: 'Faraid distribution applied by Religious Courts for Muslim estates.',
    },
  ],
  TH: [
    {
      title: 'Civil and Commercial Code Book VI',
      statute: 'Thailand · §1646–§1755',
      description: 'Five recognised will forms incl. ordinary written, holographic, public document.',
    },
    {
      title: 'Statutory Heirs',
      statute: 'Thailand · §1629',
      description: 'Six classes of heirs in priority order; spouse takes alongside each class.',
    },
    {
      title: 'Probate Petition',
      statute: 'Thailand · §1713',
      description: 'Court-appointed administrator manages and distributes the estate.',
    },
  ],
  AU: [
    {
      title: 'Wills Act (state-based)',
      statute: 'AU · NSW Wills Act 1837',
      description: 'Each state has its own Wills Act; common requirements are 18+ and two witnesses.',
    },
    {
      title: 'Succession Act (intestacy)',
      statute: 'AU · NSW Succession Act 2006',
      description: 'Distribution to spouse, de facto partner, and children when there is no will.',
    },
    {
      title: 'Family Provision Claims',
      statute: 'AU · Succession Act Ch. 3',
      description: 'Eligible persons may apply to court for adequate provision from the estate.',
    },
  ],
  NZ: [
    {
      title: 'Wills Act 2007',
      statute: 'NZ · §11',
      description: 'Testator 18+; signed in the presence of two witnesses who also sign.',
    },
    {
      title: 'Administration Act 1969',
      statute: 'NZ · §77',
      description: 'Order of intestate distribution and administration of small estates.',
    },
    {
      title: 'Property (Relationships) Act',
      statute: 'NZ · 1976',
      description: 'A surviving partner may elect under the Act instead of taking under the will.',
    },
  ],
  BN: [
    {
      title: 'Wills Act',
      statute: 'Brunei · Cap. 194',
      description: 'Formal will requirements for non-Muslim testators in Brunei.',
    },
    {
      title: 'Intestate Succession Act',
      statute: 'Brunei · Cap. 191',
      description: 'Statutory shares to spouse and issue when no will exists.',
    },
    {
      title: 'Islamic Adoption of Children Order',
      statute: 'Brunei · Faraid principles',
      description: 'Muslim estates follow Faraid; matters heard by the Syariah Court.',
    },
  ],
  VN: [
    {
      title: 'Civil Code — Part Four',
      statute: 'Vietnam · Arts. 624–648',
      description: 'Written and oral wills; notarised, witnessed, or holographic forms.',
    },
    {
      title: 'Forced Heirship',
      statute: 'Vietnam · Art. 644',
      description: 'Minor children, parents, and incapacitated spouse always inherit two-thirds.',
    },
    {
      title: 'Notary Law 2014',
      statute: 'Vietnam · No. 53/2014/QH13',
      description: 'Procedure for notarising a will at a Notary Public Office.',
    },
  ],
  PH: [
    {
      title: 'Civil Code',
      statute: 'PH · Arts. 774–1105',
      description: 'Notarial and holographic wills; testator 18+ and of sound mind.',
    },
    {
      title: 'Legitime (Compulsory Heirs)',
      statute: 'PH · Art. 886',
      description: 'A reserved portion the testator cannot dispose of away from compulsory heirs.',
    },
    {
      title: 'Rule 75 — Probate of Will',
      statute: 'PH · Rules of Court',
      description: 'Every will must be probated before any property can be transferred.',
    },
  ],
};

export function getReferencesForCountry(code: string): Reference[] {
  return REFERENCES_BY_COUNTRY[code] ?? REFERENCES_BY_COUNTRY.SG;
}
