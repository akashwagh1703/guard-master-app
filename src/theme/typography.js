import fonts from './fonts';
import colors from './colors';

export default {
  hero: { fontFamily: fonts.bold, fontSize: 32, color: colors.text, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.bold, fontSize: 26, color: colors.text, letterSpacing: -0.3 },
  h2: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  h3: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 16, color: colors.text, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 16, color: colors.text },
  bodySm: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  label: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textSecondary },
  caption: { fontFamily: fonts.medium, fontSize: 12, color: colors.textMuted },
  button: { fontFamily: fonts.bold, fontSize: 17, letterSpacing: 0.2 },
  buttonSm: { fontFamily: fonts.semibold, fontSize: 15 },
  tab: { fontFamily: fonts.semibold, fontSize: 11 },
};
