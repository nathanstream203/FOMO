// app/_layout.tsx
import * as React from 'react';
import LoginConfig from '../app/loginConfig';

// ✅ Super clean: this only decides if you're logged in or not
export default function Layout() {
  return <LoginConfig />;
}
