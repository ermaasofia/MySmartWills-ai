export const SUGGESTIONS_BY_COUNTRY: Record<string, string[]> = {
  MY: [
    'Who can be an executor under the Wills Act 1959?',
    "What if I don't have a will in Malaysia?",
    'How does the Distribution Act 1958 split my estate?',
    'Handling overseas assets',
  ],
  MY_WK: [
    'How does Faraid divide my estate?',
    'What can I leave through Wasiat?',
    'Can I use Hibah for my child?',
    'Wasiat vs conventional will',
  ],
  SG: [
    'Who can be an executor in Singapore?',
    'How do I change my will later?',
    'CPF nominations vs my will',
    'Handling overseas assets',
  ],
  HK: [
    'Who can witness my Hong Kong will?',
    "What happens if I die intestate in HK?",
    'How do I get a Grant of Representation?',
    'Handling Mainland China assets',
  ],
  CN: [
    'Which will form is most enforceable?',
    'How are statutory heirs ordered?',
    'Notarised vs holographic will',
    'Cross-border asset transfer',
  ],
  TW: [
    'How do I write a holographic will?',
    'What is the compulsory portion?',
    'Inheritance tax in Taiwan',
    'Naming an executor',
  ],
  ID: [
    'What is an akta wasiat?',
    'KUHPerdata vs Faraid',
    'How do I appoint a notary?',
    'Inheritance for non-Muslims',
  ],
  TH: [
    'Which will form should I choose?',
    'Order of statutory heirs in Thailand',
    'Probate procedure in Thailand',
    'Foreign assets and Thai law',
  ],
  AU: [
    'Wills Act requirements in my state',
    'What is a family provision claim?',
    'Superannuation and your will',
    'Naming a guardian for kids',
  ],
  NZ: [
    'Wills Act 2007 — what do I need?',
    'Relationship Property Act elections',
    'Dying without a will in NZ',
    'Naming an executor',
  ],
  BN: [
    'Wills Act requirements in Brunei',
    'Intestate distribution in Brunei',
    'Faraid for Muslim estates',
    'Property abroad',
  ],
  VN: [
    'How do I notarise my will?',
    'Forced heirship in Vietnam',
    'Holographic vs notarial will',
    'Foreign beneficiaries',
  ],
  PH: [
    'Notarial vs holographic will',
    'Who are compulsory heirs?',
    'Probate procedure in the Philippines',
    'Estate tax basics',
  ],
};

export function getSuggestionsForCountry(code: string): string[] {
  return SUGGESTIONS_BY_COUNTRY[code] ?? SUGGESTIONS_BY_COUNTRY.SG;
}
