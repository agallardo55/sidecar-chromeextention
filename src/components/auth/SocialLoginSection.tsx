
import { SocialLoginButton } from './SocialLoginButton';

interface SocialLoginSectionProps {
  isLoading: {
    google: boolean;
    microsoft: boolean;
    apple: boolean;
  };
  onSocialLogin: (provider: 'google' | 'microsoft' | 'apple') => void;
}

export const SocialLoginSection = ({ isLoading, onSocialLogin }: SocialLoginSectionProps) => {
  return (
    <div className="space-y-3">
      <SocialLoginButton
        provider="google"
        isLoading={isLoading.google}
        onClick={() => onSocialLogin('google')}
      />
      <SocialLoginButton
        provider="microsoft"
        isLoading={isLoading.microsoft}
        onClick={() => onSocialLogin('microsoft')}
      />
      <SocialLoginButton
        provider="apple"
        isLoading={isLoading.apple}
        onClick={() => onSocialLogin('apple')}
      />
    </div>
  );
};
