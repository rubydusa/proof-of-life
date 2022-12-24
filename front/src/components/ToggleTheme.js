import React, { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const LIGHT_THEME = {
  '--text-color': 'var(--black)',
  '--page-color': 'var(--white)',
  '--navbar-color': 'var(--black)',
  '--border-color': 'var(--gray)',
  '--bordered-content-color': 'var(--mid-main)',
}

const DARK_THEME = {
  '--text-color': 'var(--mid-white)',
  '--page-color': 'var(--dark-gray)',
  '--navbar-color': 'var(--black)',
  '--border-color': 'var(--mid-light-gray)',
  '--bordered-content-color': 'var(--mid-gray)',
}

export default function ToggleTheme() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkTheme', false);

  useEffect(() => {
    setTheme(isDarkMode);
  }, []);

  useEffect(() => {
    setTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <button className='btn restrict-bounce' onClick={() => setIsDarkMode(!isDarkMode)}>
      Toggle Theme
    </button>
  )
}

const setTheme = (isDarkMode) => {
  if (isDarkMode) {
    setCSSVars(DARK_THEME);
  }
  else {
    setCSSVars(LIGHT_THEME);
  }
}

const setCSSVars = (vars) => {
  Object.entries(vars).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
}