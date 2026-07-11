import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => console.log('[Pathao] App bootstrapped successfully'))
  .catch(err => {
    console.error('[Pathao] Bootstrap FAILED:', err);
    document.body.innerHTML = `
      <div style="font-family:monospace;padding:24px;color:red;background:#fff;">
        <h2>Pathao Driver Portal Bootstrap Error</h2>
        <pre>${err?.message || err}</pre>
      </div>`;
  });
