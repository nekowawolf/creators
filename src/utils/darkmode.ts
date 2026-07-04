export const toggleDarkMode = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      `* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
      }`
    )
  );
  document.head.appendChild(css);

    const isDark = document.documentElement.classList.contains('darkmode');
    if (isDark) {
        document.documentElement.classList.remove('darkmode');
        localStorage.setItem('darkmode', 'inactive');
    } else {
        document.documentElement.classList.add('darkmode');
        localStorage.setItem('darkmode', 'active');
    }

  const _ = window.getComputedStyle(css).opacity;
  document.head.removeChild(css);
};

export const initializeDarkMode = () => {
    if (typeof window !== 'undefined') {
        const isDark = localStorage.getItem('darkmode') === 'active';
        if (isDark) {
            document.documentElement.classList.add('darkmode');
        } else {
            document.documentElement.classList.remove('darkmode');
        }
    }
};
