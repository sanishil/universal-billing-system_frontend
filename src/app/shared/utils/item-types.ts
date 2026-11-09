/**
 * Ready-made line items for bills; 'other' lets the user type any description.
 * monthly items are billed for a month, which is written into the description,
 * e.g. "Room Rent – Nov 2026".
 */
export const ITEM_TYPES: { key: string; label: string; hsnSac?: string; monthly?: boolean }[] = [
  { key: 'room-rent',   label: 'Room Rent',           hsnSac: '997211', monthly: true },
  { key: 'electricity', label: 'Electricity Charges', hsnSac: '996912', monthly: true },
  { key: 'water',       label: 'Water Charges',       hsnSac: '996922', monthly: true },
  { key: 'maintenance', label: 'Maintenance Charges', monthly: true },
  { key: 'other',       label: 'Others' }
];

const MONTH_SEPARATOR = ' – ';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** This month as an <input type="month"> value, e.g. "2026-11" */
export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function isMonthly(key: string): boolean {
  return !!ITEM_TYPES.find(t => t.key === key)?.monthly;
}

/** "Room Rent" + "2026-11" → "Room Rent – Nov 2026" */
export function itemName(label: string, month: string): string {
  const [y, m] = month.split('-').map(Number);
  return y && m ? `${label}${MONTH_SEPARATOR}${MONTHS[m - 1]} ${y}` : label;
}

/** The type and month of an item, read back from its description */
export function parseItemName(name: string): { kind: string; month: string } {
  const [label, period] = name.split(MONTH_SEPARATOR);
  const type = ITEM_TYPES.find(t => t.key !== 'other' && t.label === label.trim());
  if (!type) return { kind: 'other', month: currentMonth() };

  const match = /^([A-Za-z]{3}) (\d{4})$/.exec((period ?? '').trim());
  const monthIndex = match ? MONTHS.indexOf(match[1]) : -1;
  const month = monthIndex >= 0 ? `${match![2]}-${String(monthIndex + 1).padStart(2, '0')}` : currentMonth();
  return { kind: type.key, month };
}

/** The type an item belongs to, from its description */
export function itemKindOf(name: string): string {
  return parseItemName(name).kind;
}
