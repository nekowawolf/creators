export const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains('darkmode');
    if (isDark) {
        document.documentElement.classList.remove('darkmode');
        localStorage.setItem('darkmode', 'inactive');
    } else {
        document.documentElement.classList.add('darkmode');
        localStorage.setItem('darkmode', 'active');
    }
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
