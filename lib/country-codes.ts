// Country dial codes for the WhatsApp field. `dial` is digits only (no +).
// Flags render from the ISO-2 code via regional-indicator letters.

export interface Country {
  iso2: string;
  name: string;
  dial: string;
}

export const COUNTRIES: Country[] = [
  { iso2: "ID", name: "Indonesia", dial: "62" },
  { iso2: "MY", name: "Malaysia", dial: "60" },
  { iso2: "SG", name: "Singapore", dial: "65" },
  { iso2: "TH", name: "Thailand", dial: "66" },
  { iso2: "PH", name: "Philippines", dial: "63" },
  { iso2: "VN", name: "Vietnam", dial: "84" },
  { iso2: "US", name: "United States", dial: "1" },
  { iso2: "CA", name: "Canada", dial: "1" },
  { iso2: "GB", name: "United Kingdom", dial: "44" },
  { iso2: "AU", name: "Australia", dial: "61" },
  { iso2: "NZ", name: "New Zealand", dial: "64" },
  { iso2: "IN", name: "India", dial: "91" },
  { iso2: "CN", name: "China", dial: "86" },
  { iso2: "HK", name: "Hong Kong", dial: "852" },
  { iso2: "TW", name: "Taiwan", dial: "886" },
  { iso2: "JP", name: "Japan", dial: "81" },
  { iso2: "KR", name: "South Korea", dial: "82" },
  { iso2: "AE", name: "United Arab Emirates", dial: "971" },
  { iso2: "SA", name: "Saudi Arabia", dial: "966" },
  { iso2: "QA", name: "Qatar", dial: "974" },
  { iso2: "TR", name: "Turkey", dial: "90" },
  { iso2: "DE", name: "Germany", dial: "49" },
  { iso2: "FR", name: "France", dial: "33" },
  { iso2: "NL", name: "Netherlands", dial: "31" },
  { iso2: "ES", name: "Spain", dial: "34" },
  { iso2: "IT", name: "Italy", dial: "39" },
  { iso2: "PT", name: "Portugal", dial: "351" },
  { iso2: "SE", name: "Sweden", dial: "46" },
  { iso2: "NO", name: "Norway", dial: "47" },
  { iso2: "DK", name: "Denmark", dial: "45" },
  { iso2: "FI", name: "Finland", dial: "358" },
  { iso2: "IE", name: "Ireland", dial: "353" },
  { iso2: "CH", name: "Switzerland", dial: "41" },
  { iso2: "AT", name: "Austria", dial: "43" },
  { iso2: "BE", name: "Belgium", dial: "32" },
  { iso2: "PL", name: "Poland", dial: "48" },
  { iso2: "RU", name: "Russia", dial: "7" },
  { iso2: "UA", name: "Ukraine", dial: "380" },
  { iso2: "BR", name: "Brazil", dial: "55" },
  { iso2: "MX", name: "Mexico", dial: "52" },
  { iso2: "AR", name: "Argentina", dial: "54" },
  { iso2: "CL", name: "Chile", dial: "56" },
  { iso2: "CO", name: "Colombia", dial: "57" },
  { iso2: "ZA", name: "South Africa", dial: "27" },
  { iso2: "NG", name: "Nigeria", dial: "234" },
  { iso2: "EG", name: "Egypt", dial: "20" },
  { iso2: "KE", name: "Kenya", dial: "254" },
  { iso2: "PK", name: "Pakistan", dial: "92" },
  { iso2: "BD", name: "Bangladesh", dial: "880" },
  { iso2: "LK", name: "Sri Lanka", dial: "94" },
];

// ISO-2 → flag emoji (two regional-indicator symbols).
export function flagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

// Compose a wa.me number: country dial + local number, digits only, with a
// single leading zero on the local part dropped (national → international).
export function waNumber(dial?: string, local?: string): string {
  const cc = (dial ?? "").replace(/\D/g, "");
  const n = (local ?? "").replace(/\D/g, "").replace(/^0+/, "");
  return cc && n ? cc + n : "";
}
