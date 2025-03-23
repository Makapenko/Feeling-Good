import React, { useEffect, useState } from 'react';
import styles from './NotificationToast.module.css';
import { Notification } from '../../store/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faInfoCircle, faExclamationTriangle, faBookOpen } from '@fortawesome/free-solid-svg-icons';

interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Получаем иконку в зависимости от типа уведомления
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faBookOpen;
    }
  };

  // Эффект анимации появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Обработчик закрытия
  const handleClose = () => {
    setIsVisible(false);
    // Небольшая задержка перед удалением для анимации
    setTimeout(() => onClose(notification.id), 300);
  };

  return (
    <div 
      className={`${styles.toast} ${styles[notification.type]} ${isVisible ? styles.visible : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.iconContainer}>
        <FontAwesomeIcon icon={getIcon()} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{notification.message}</p>
      </div>
      <button 
        className={styles.closeButton} 
        onClick={handleClose}
        aria-label="Закрыть уведомление"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default NotificationToast; 
