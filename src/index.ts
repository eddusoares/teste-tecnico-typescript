import { setupApp } from './setup-app';

const app = setupApp();

app.listen(3200, () => {
  console.log('Servidor ativo na porta 3200');
});
