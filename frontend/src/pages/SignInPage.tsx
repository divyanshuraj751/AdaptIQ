import { SignIn } from '@clerk/react';

const SignInPage = () => (
  <div className="clerk-auth-page">
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/"
    />
  </div>
);

export default SignInPage;
