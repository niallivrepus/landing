export const PHONE_COUNTRY_DIAL_CODES = [
  { code: "us", name: "United States", dial: "+1", flag: "united states" },
  { code: "gb", name: "United Kingdom", dial: "+44", flag: "united kingdom" },
  { code: "nl", name: "Netherlands", dial: "+31", flag: "netherlands" },
  { code: "de", name: "Germany", dial: "+49", flag: "germany" },
  { code: "fr", name: "France", dial: "+33", flag: "france" },
  { code: "ca", name: "Canada", dial: "+1", flag: "canada" },
  { code: "au", name: "Australia", dial: "+61", flag: "australia" },
  { code: "jp", name: "Japan", dial: "+81", flag: "japan" },
  { code: "in", name: "India", dial: "+91", flag: "india" },
  { code: "br", name: "Brazil", dial: "+55", flag: "brazil" },
  { code: "mx", name: "Mexico", dial: "+52", flag: "mexico" },
  { code: "cn", name: "China", dial: "+86", flag: "china" },
  { code: "kr", name: "South Korea", dial: "+82", flag: "south korea" },
  { code: "it", name: "Italy", dial: "+39", flag: "italy" },
  { code: "es", name: "Spain", dial: "+34", flag: "spain" },
  { code: "ng", name: "Nigeria", dial: "+234", flag: "nigeria" },
  { code: "gh", name: "Ghana", dial: "+233", flag: "ghana" },
  { code: "za", name: "South Africa", dial: "+27", flag: "south africa" },
  { code: "ke", name: "Kenya", dial: "+254", flag: "kenya" },
  { code: "se", name: "Sweden", dial: "+46", flag: "sweden" },
] as const;

export type PhoneCountryCode = (typeof PHONE_COUNTRY_DIAL_CODES)[number]["code"];

export function findPhoneCountry(code: string) {
  return PHONE_COUNTRY_DIAL_CODES.find((entry) => entry.code === code) ?? PHONE_COUNTRY_DIAL_CODES[0];
}

export function formatPhoneE164(countryCode: string, localDigits: string) {
  const country = findPhoneCountry(countryCode);
  const digits = localDigits.replace(/\D/g, "");
  return `${country.dial}${digits}`;
}
