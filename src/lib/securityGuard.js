/**
 * Client-Side Source Protection & Anti-Tamper Guard
 * Provides anti-inspection shortcuts blocking, contextmenu protection, and console watermark warnings.
 */

export function initSecurityGuard() {
  // 1. Console Intellectual Property & Anti-Tamper Notice
  if (typeof window !== 'undefined') {
    const bannerStyle = `
      background: #09090b;
      color: #10b981;
      font-size: 14px;
      font-weight: bold;
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid #27272a;
    `;
    const textStyle = `
      color: #a1a1aa;
      font-size: 11px;
      line-height: 1.5;
    `;

    setTimeout(() => {
      console.clear();
      console.log('%c⚡ LeadFlow CRM — Proprietary POC & Intellectual Property', bannerStyle);
      console.log(
        '%cUnauthorized copying, reverse-engineering, or decompilation of this application bundle is strictly restricted. For licensing, partnership, or custom CRM implementations, contact the developer at WhatsApp: https://wa.me/60135928812',
        textStyle
      );
    }, 500);

    // 2. Prevent right-click context menu (allowing it only on text inputs and textareas)
    window.addEventListener('contextmenu', (e) => {
      const target = e.target;
      const isInput = target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('#printable-document')
      );
      if (!isInput) {
        e.preventDefault();
      }
    }, { capture: true });

    // 3. Intercept DevTools and Inspection Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const key = e.key ? e.key.toUpperCase() : '';
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if (
        (cmdOrCtrl && e.shiftKey && (key === 'I' || key === 'J' || key === 'C')) ||
        (isMac && e.metaKey && e.altKey && (key === 'I' || key === 'J' || key === 'C'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+U (View Source)
      if (cmdOrCtrl && key === 'U') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page HTML)
      if (cmdOrCtrl && key === 'S') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { capture: true });

    // 4. Disable drag of non-draggable images and logos
    window.addEventListener('dragstart', (e) => {
      const target = e.target;
      if (target && target.tagName === 'IMG' && !target.hasAttribute('draggable')) {
        e.preventDefault();
      }
    });
  }
}
