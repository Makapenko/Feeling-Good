import React from 'react';
import { useAppDispatch, useNotifications } from '../../redux/hooks';
import { removeNotification } from '../../redux/slices/notificationSlice';
import NotificationToast from './NotificationToast';
import styles from './NotificationContainer.module.css';

const NotificationContainer: React.FC = () => {
  const notifications = useNotifications();
  const dispatch = useAppDispatch();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={(id) => dispatch(removeNotification(id))}
        />
      ))}
    </div>
  );
};

export default NotificationContainer; 
