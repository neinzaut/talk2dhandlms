import React from 'react';

const TopNav: React.FC = () => {
    return (
        <nav style={styles.nav}>
            <img src='/../../../assets/icons/logo.png' style={styles.logo} alt="Logo"></img>
            <ul style={styles.navLinks}>
                <li style={styles.navItem}><a href="#home" style={styles.navLink}>Streak</a></li>
                <li style={styles.navItem}><a href="#about" style={styles.navLink}>Dropdown</a></li>
                <li style={styles.navItem}><a href="#contact" style={styles.navLink}>User</a></li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        paddingRight: '200px',
        paddingLeft: '200px',
        backgroundColor: '#333',
        color: '#fff',
        width: '100%',
        height: '40px',
    },
    logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinks: {
        listStyle: 'none',
        display: 'flex',
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

export default TopNav;