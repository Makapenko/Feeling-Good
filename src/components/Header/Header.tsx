import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>Терапия настроения</h1>
    </header>
  );
};

export default Header;
