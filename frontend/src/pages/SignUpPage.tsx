import { SignUp } from '@clerk/react';

const SignUpPage = () => (
  <div className="clerk-auth-page">
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/"
    />
  </div>
);

export default SignUpPage;
