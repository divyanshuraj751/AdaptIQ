import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f7f3ea' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 900, color: '#1f2933' }}>404</h1>
        <p style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#687386' }}>Oops! Page not found</p>
        <a href="/" style={{ color: '#3d7c75', textDecoration: 'underline', fontWeight: 750 }}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
