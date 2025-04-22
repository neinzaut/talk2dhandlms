import React from 'react';

const Leaderboard: React.FC = () => {
    return (
        <nav style={styles.nav}>
            <ul style={styles.navLinks}>
                <li style={styles.navItem}><a href="#home" style={styles.navLink}>Learn</a></li>
                <li style={styles.navItem}><a href="#about" style={styles.navLink}>Practice</a></li>
                <li style={styles.navItem}><a href="#contact" style={styles.navLink}>AI Converse</a></li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        boxSizing: 'border-box' as 'border-box',
        position: 'fixed',
        top: 0,
        right: 0,
        padding: '10px 20px',
        paddingTop: '80px',
        backgroundColor: '#0073FF',
        color: '#0073FF',
        width: '30vh',
        height: '100vh',
        zIndex: '-2',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
    },
    navItem: {
        marginLeft: '20px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
    },
};

export default Leaderboard;