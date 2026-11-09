/** Ready-made line items for bills; 'other' lets the user type any description */
export const ITEM_TYPES: { key: string; label: string; hsnSac?: string }[] = [
  { key: 'room-rent',   label: 'Room Rent',           hsnSac: '997211' },
  { key: 'electricity', label: 'Electricity Charges', hsnSac: '996912' },
  { key: 'water',       label: 'Water Charges',       hsnSac: '996922' },
  { key: 'maintenance', label: 'Maintenance Charges' },
  { key: 'other',       label: 'Others' }
];

/** The type an item belongs to, from its description */
export function itemKindOf(name: string): string {
  return ITEM_TYPES.find(t => t.key !== 'other' && t.label === name)?.key ?? 'other';
}
