import { Dimensions } from 'react-native';

export function getLayoutProfile() {
  const { width, height } = Dimensions.get('window');

  const shortest = Math.min(width, height);
  const longest = Math.max(width, height);

  const isSmallPhone = shortest <= 375 || longest <= 720;
  const isPhone = shortest < 768;
  const isTablet = shortest >= 768 && shortest < 1024;
  const isDesktop = shortest >= 1024;

  return {
    width,
    height,
    shortest,
    longest,
    isSmallPhone,
    isPhone,
    isTablet,
    isDesktop,

    heroPaddingTop: isSmallPhone ? 40 : isPhone ? 60 : 80,
    heroPaddingHorizontal: isSmallPhone ? 14 : 16,
    heroJustifyContent: isSmallPhone ? 'flex-start' : 'center',

    titleMin: isSmallPhone ? 22 : 30,
    titleMax: isSmallPhone ? 40 : 56,

    subtitleMin: isSmallPhone ? 12 : 14,
    subtitleMax: isSmallPhone ? 16 : 18,

    statGap: isSmallPhone ? 12 : 18,
    sectionSpacing: isSmallPhone ? 14 : 22,
    cardPadding: isSmallPhone ? 14 : 18,
    ctaTop: isSmallPhone ? 6 : 0,
    userLabelBlockBottom: isSmallPhone ? 14 : 20,
  };
}