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
        fontSize: '16px',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      },
      securityLevel: 'loose',
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 50,
        width: 200,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: false,
        rightAngles: false,
        showSequenceNumbers: false,
        actorFontSize: '16px',
        actorFontFamily: 'ui-sans-serif, system-ui',
        actorFontWeight: 400,
        noteFontSize: '14px',
        noteFontFamily: 'ui-sans-serif, system-ui',
        noteFontWeight: 400,
        noteAlign: 'center',
        messageFontSize: '16px',
        messageFontFamily: 'ui-sans-serif, system-ui',
        messageFontWeight: 400,
      },
    });

    // 渲染圖表
    if (ref.current) {
      ref.current.innerHTML = chart;
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="my-8 overflow-x-auto">
      <div className="flex justify-center min-w-fit">
        <div 
          ref={ref}
          className="mermaid bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
          style={{ minWidth: '800px', fontSize: '16px' }}
        />
      </div>
    </div>
  );
};

export default Mermaid;