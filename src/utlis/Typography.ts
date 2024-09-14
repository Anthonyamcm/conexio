import {
  Poppins_100Thin as PoppinsThin,
  Poppins_300Light as PoppinsLight,
  Poppins_400Regular as PoppinsRegular,
  Poppins_500Medium as PoppinsMedium,
} from '@expo-google-fonts/poppins';

export const customFontsToLoad = {
  PoppinsThin,
  PoppinsLight,
  PoppinsRegular,
  PoppinsMedium,
};

const fonts = {
  Poppins: {
    thin: 'PoppinsThin',
    light: 'PoppinsLight',
    normal: 'PoppinsRegular',
    medium: 'PoppinsMedium',
  },
};

export const typography = {
  fonts,
  primary: fonts.Poppins,
};
