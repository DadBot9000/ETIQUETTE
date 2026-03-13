import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { signInWithGoogle } from '../lib/googleAuth';
import LuxuryRing from '../components/LuxuryRing';

export default function AuthScreen({
  t,
  showToast,
  windowWidth,
  completeAuthLogin,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    completeAuthLogin?.();
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { idToken, user } = await signInWithGoogle();

      if (!idToken || !user) {
        setIsSubmitting(false);
        showToast(t('google_login_failed'), 'error');
        return;
      }

      completeAuthLogin?.();
setTimeout(() => {
  setIsSubmitting(false);
}, 800);
    } catch (error) {
      setIsSubmitting(false);
      showToast(t('google_login_failed'), 'error');
    }
  };

  return (
    <View style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.innerContainer}>
          <Text style={s.title}>
            {isLogin ? t('login_title') : t('register_title')}
          </Text>

          <TextInput
            style={s.input}
            placeholder={t('email')}
            placeholderTextColor="#888888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isSubmitting}
          />

          <TextInput
            style={s.input}
            placeholder={t('password')}
            placeholderTextColor="#888888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[s.button, isSubmitting && s.buttonDisabled]}
            onPress={handleAuth}
            disabled={isSubmitting}
          >
            <Text style={s.buttonText}>
              {isLogin ? t('login') : t('register')}
            </Text>
          </TouchableOpacity>

          <View style={s.dividerContainer}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>{t('or_continue_with')}</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.socialContainer}>
            {['Google', 'Facebook', 'X'].map((provider) => (
              <TouchableOpacity
                key={provider}
                style={[s.socialButton, isSubmitting && s.buttonDisabled]}
                onPress={
                  provider === 'Google'
                    ? handleGoogleLogin
                    : () =>
                        showToast(
                          t('social_login_coming_soon').replace('{provider}', provider),
                          'info'
                        )
                }
                disabled={isSubmitting}
              >
                <Text style={s.socialText}>{provider}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={s.switchAuth}
            onPress={() => setIsLogin(!isLogin)}
            disabled={isSubmitting}
          >
            <Text style={s.switchAuthText}>
              {isLogin ? t('dont_have_account') : t('already_have_account')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {Platform.OS === 'ios' && (
        <View style={s.ringsOverlay}>
          <LuxuryRing size={windowWidth * 0.15} />
          <LuxuryRing size={windowWidth * 0.15} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  innerContainer: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: Platform.OS === 'ios' ? 100 : 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay_700',
    color: '#D4AF37',
    marginBottom: 50,
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#333333',
    marginBottom: 25,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_400',
  },
  button: {
    height: 50,
    backgroundColor: '#C5A059',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.72,
  },
  buttonText: {
    color: '#000000',
    fontFamily: 'PlayfairDisplay_700',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#333333' },
  dividerText: {
    color: '#888888',
    paddingHorizontal: 15,
    fontSize: 12,
    fontFamily: 'PlayfairDisplay_400',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    width: '30%',
    alignItems: 'center',
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_500',
  },
  switchAuth: { marginTop: 10, alignItems: 'center' },
  switchAuthText: {
    color: '#D4AF37',
    fontSize: 14,
    fontFamily: 'PlayfairDisplay_500',
  },
  ringsOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
});