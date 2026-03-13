import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '1064479699571-7mqgi34cv0ibgvf75etns3sskn7dcp0b.apps.googleusercontent.com',
  scopes: ['email', 'profile'],
  offlineAccess: false,
forceCodeForRefreshToken: false
});

export type GoogleAuthResult = {
  idToken: string;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    photo?: string | null;
    familyName?: string | null;
    givenName?: string | null;
  };
};

export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  await GoogleSignin.hasPlayServices();

  const result: any = await GoogleSignin.signIn();

  const idToken = result?.data?.idToken ?? result?.idToken ?? null;
  const user = result?.data?.user ?? result?.user ?? null;

  if (!idToken || !user) {
    throw new Error('Brak idToken lub danych użytkownika z Google.');
  }

  return { idToken, user };
}

export async function signOutFromGoogle(): Promise<void> {
  await GoogleSignin.signOut();
}

export function isGoogleCancelled(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error
    ? (error as any).code === statusCodes.SIGN_IN_CANCELLED
    : false;
}

export function isGoogleInProgress(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error
    ? (error as any).code === statusCodes.IN_PROGRESS
    : false;
}