import React from 'react';
import { Link } from 'react-router-dom';
import { Show, UserButton } from '@clerk/react';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="adapt-topnav">
      <Link to="/" className="adapt-brand">
        <BookOpen size={22} />
        <span>Quizora</span>
      </Link>

      <div className="adapt-nav-actions">
        <Show when="signed-out">
          <Link to="/sign-in" className="adapt-nav-btn adapt-nav-btn--ghost">Log In</Link>
          <Link to="/sign-up" className="adapt-nav-btn adapt-nav-btn--primary">Sign Up</Link>
        </Show>

        <Show when="signed-in">
          <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 36, height: 36 } } }} />
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;
