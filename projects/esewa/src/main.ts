import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => console.log('[eSewa] App bootstrapped successfully'))
  .catch(err => {
    console.error('[eSewa] Bootstrap FAILED:', err);
    // Show visible error on blank page
    document.body.innerHTML = `
      <div style="font-family:monospace;padding:24px;color:red;background:#fff;">
        <h2>eSewa Bootstrap Error</h2>
        <pre>${err?.message || err}</pre>
      </div>`;
  });
