import request from 'supertest';
import { ClientService } from '../../services/client/client.service';
import { setupApp } from '../../setup-app';
import { buildClient } from '../../utils/test/builders/build-client';

const app = setupApp();

jest.mock('../../services/client/client.service');

describe('ClientController', () => {
  it('should get all clients', async () => {
    (ClientService.prototype.getAllClients as jest.Mock).mockResolvedValue([]);
    const response = await request(app).get('/clients');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should get client by id', async () => {
    const client = buildClient({
      id: 1,
      nome: 'Eduardo Soares get',
    });

    jest.mocked(ClientService.prototype.getClientById).mockResolvedValue(client);
    const response = await request(app).get('/clients/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(client);
  });

  it('should create a new client', async () => {
    const newClient = buildClient({
      nome: 'Eduardo Soares created',
    });

    jest.mocked(ClientService.prototype.create).mockResolvedValue(undefined);
    const response = await request(app)
      .post('/clients')
      .send({ ...newClient, id: undefined });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Usuário criado com sucesso!' });
  });

  it('should update a client', async () => {
    const updatedClient = buildClient({
      nome: 'Eduardo Soares updated',
    });

    jest.mocked(ClientService.prototype.update).mockResolvedValue(undefined);
    const response = await request(app)
      .put('/clients/1')
      .send({ ...updatedClient, id: undefined });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Usuário alterado com sucesso!' });
  });

  it('should delete a client', async () => {
    (ClientService.prototype.delete as jest.Mock).mockResolvedValue(undefined);
    const response = await request(app).delete('/clients/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Usuário excluído com sucesso!' });
  });
});
