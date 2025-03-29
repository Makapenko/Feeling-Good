import React, { useEffect, useRef } from 'react';
import { DASCategoryResult } from './DysfunctionalAttitudeTypes';
import styles from './DysfunctionalAttitudeScale.module.css';
import { CATEGORY_DESCRIPTIONS } from './dasConfig';

interface ResultsChartProps {
  categoryResults: DASCategoryResult[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ categoryResults }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Наносим на график результаты
    const chart = chartRef.current;
    const chartWidth = chart.clientWidth;
    const barWidth = 30;
    const spacing = (chartWidth - 60) / 7; // 7 категорий
    const zeroLinePosition = chart.clientHeight / 2;

    // Создаем ось Y
    const axisY = document.createElement('div');
    axisY.className = styles.chartAxisY;
    chart.appendChild(axisY);

    // Создаем ось X (нулевую линию)
    const axisX = document.createElement('div');
    axisX.className = styles.chartAxisX;
    axisX.style.top = `${zeroLinePosition}px`;
    axisX.style.bottom = 'auto';
    chart.appendChild(axisX);

    // Добавляем метки на оси Y
    [-10, -5, 0, 5, 10].forEach(value => {
      const label = document.createElement('div');
      label.className = styles.chartAxisLabel;
      label.textContent = value.toString();
      
      // Позиционируем метки
      const yPos = zeroLinePosition - (value / 20) * (chart.clientHeight - 100);
      label.style.top = `${yPos}px`;
      label.style.left = '10px';
      
      chart.appendChild(label);
    });

    // Рисуем столбцы для каждой категории
    categoryResults.forEach((result, index) => {
      const { category, score } = result;

      // Находим название категории
      const categoryDesc = CATEGORY_DESCRIPTIONS.find(desc => desc.category === category);
      const categoryTitle = categoryDesc ? categoryDesc.title : category;

      // Создаем столбец
      const bar = document.createElement('div');
      bar.className = score >= 0 ? styles.chartBar : `${styles.chartBar} ${styles.negative}`;
      
      // Рассчитываем позицию и высоту столбца
      const barLeft = 30 + spacing * index;
      const barHeight = Math.abs(score) * (chart.clientHeight - 100) / 20;
      
      bar.style.left = `${barLeft}px`;
      bar.style.height = `${barHeight}px`;
      
      if (score < 0) {
        bar.style.top = `${zeroLinePosition}px`;
      } else {
        bar.style.bottom = `${chart.clientHeight - zeroLinePosition}px`;
      }
      
      chart.appendChild(bar);

      // Добавляем метку категории
      const label = document.createElement('div');
      label.className = styles.barLabel;
      label.textContent = categoryTitle;
      label.style.left = `${barLeft + barWidth / 2}px`;
      label.style.bottom = '20px';
      
      chart.appendChild(label);
    });

    // Очищаем график при размонтировании
    return () => {
      if (chartRef.current) {
        const chart = chartRef.current;
        while (chart.firstChild) {
          chart.removeChild(chart.firstChild);
        }
      }
    };
  }, [categoryResults]);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Профиль системы убеждений</h3>
      <div className={styles.chart} ref={chartRef}></div>
    </div>
  );
};

export default ResultsChart; 
