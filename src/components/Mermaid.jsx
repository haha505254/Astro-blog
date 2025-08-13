import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export const Mermaid = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    // 初始化 Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      themeVariables: {
        primaryColor: '#2563eb',
        primaryTextColor: '#fff',
        primaryBorderColor: '#1d4ed8',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#fff',
        background: '#ffffff',
        mainBkg: '#2563eb',
        secondBkg: '#f3f4f6',
        tertiaryBkg: '#fff',
        primaryBorderColor: '#1d4ed8',
        secondaryBorderColor: '#d1d5db',
        tertiaryBorderColor: '#e5e7eb',
        fontSize: '14px',
      },
      securityLevel: 'loose',
    });

    // 渲染圖表
    if (ref.current) {
      ref.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="my-8 flex justify-center">
      <div 
        ref={ref}
        className="mermaid bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      />
    </div>
  );
};

export default Mermaid;