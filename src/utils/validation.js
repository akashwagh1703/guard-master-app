export const validators = {
  required: (v, msg = 'This field is required') =>
    v === null || v === undefined || String(v).trim() === '' ? msg : '',

  minLength: (min, msg) => (v) => {
    if (!v) return '';
    return String(v).trim().length < min ? msg || `Minimum ${min} characters` : '';
  },

  phone: (v, msg = 'Enter a valid mobile number') => {
    if (!v) return '';
    const c = String(v).replace(/[\s\-()]/g, '');
    return /^\+?\d{10,15}$/.test(c) ? '' : msg;
  },

  numeric: (v, msg = 'Numbers only') => {
    if (!v) return '';
    return /^\d+$/.test(String(v).trim()) ? '' : msg;
  },
};

export function sanitizeNumeric(value) {
  return String(value || '').replace(/\D/g, '');
}

export function sanitizePhone(value) {
  return String(value || '').replace(/[^\d+\s\-()]/g, '');
}

export function validateForm(values, rules) {
  const errors = {};
  let isValid = true;
  Object.keys(rules).forEach((field) => {
    for (const rule of rules[field]) {
      const err = rule(values[field]);
      if (err) { errors[field] = err; isValid = false; break; }
    }
  });
  return { errors, isValid };
}

export function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
