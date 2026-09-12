export function parseCsv(str: string): string[][] {
  const arr: string[][] = [];
  let quote = false;
  let row: string[] = [];
  let col = '';
  for (let c = 0; c < str.length; c++) {
    const cc = str[c], nc = str[c + 1];
    if (cc === '"' && quote && nc === '"') { col += cc; ++c; continue; }
    if (cc === '"') { quote = !quote; continue; }
    if (cc === ',' && !quote) { row.push(col); col = ''; continue; }
    if (cc === '\r' && nc === '\n' && !quote) { row.push(col); arr.push(row); col = ''; row = []; ++c; continue; }
    if (cc === '\n' && !quote) { row.push(col); arr.push(row); col = ''; row = []; continue; }
    if (cc === '\r' && !quote) { row.push(col); arr.push(row); col = ''; row = []; continue; }
    col += cc;
  }
  if (col !== '' || row.length > 0) { row.push(col); arr.push(row); }
  return arr;
}

export function extractAttendeesFromCsv(csvText: string) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) throw new Error("CSV has no data rows. Make sure it contains headers and at least one attendee.");
  
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const emailIdx = headers.indexOf('email');
  const couponIdx = headers.findIndex(h => h === 'coupon_code');
  const nameIdx = headers.indexOf('name');

  if (emailIdx === -1 || couponIdx === -1) {
    throw new Error('CSV must contain "email" and "coupon_code" columns.');
  }

  const attendees = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length <= Math.max(emailIdx, couponIdx)) continue;
    
    const email = row[emailIdx]?.trim();
    const couponCode = row[couponIdx]?.trim();
    if (!email || !couponCode) continue;

    const attendee: any = { email, couponCode };
    if (nameIdx !== -1 && row[nameIdx]?.trim()) {
      attendee.name = row[nameIdx].trim();
    }
    attendees.push(attendee);
  }
  
  return attendees;
}
