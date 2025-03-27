// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { testMigration } from './redux/migrationTest'

// Запускаем тест миграции при загрузке приложения
// В консоли будет отображена информация о результатах миграции
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    testMigration();
    console.log('🚀 Миграция на Redux завершена. Уведомления о новом контенте будут показаны при разблокировке новых глав или нажатии кнопки "Разблокировать контент".');
  }, 1000);
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
