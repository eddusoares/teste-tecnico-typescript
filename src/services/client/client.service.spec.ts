import { buildClient } from '../../utils/test/builders/build-client';
import { describe, expect } from '@jest/globals';
import { ClientService } from './client.service';
import { mock } from 'jest-mock-extended';
import { ClientRepository } from '../../repositories/client.repository';
import { NotFoundError } from '../../errors/not-found.error';
import { Client } from '../../models/client.model';

describe('ClientService', () => {
  const clientRepo = mock<ClientRepository>();

  const sut = new ClientService(clientRepo);

  describe(sut.getAllClients.name, () => {
    it('SHOULD call clientRepo.getAll', async () => {
      await sut.getAllClients();

      expect(clientRepo.getAllClients).toHaveBeenCalled();
    });
  });

  describe(sut.getClientById.name, () => {
    describe('ALWAYS', () => {
      beforeEach(async () => {
        await sut.getClientById(123).catch((err) => null);
      });

      it('SHOULD call clientRepo.getById with passed clientId', () => {
        expect(clientRepo.getById).toHaveBeenCalledTimes(1);
        expect(clientRepo.getById).toHaveBeenCalledWith(123);
      });
    });

    describe('WHEN clientRepo.getById returns null', () => {
      let expectedError: Error;
      beforeEach(async () => {
        clientRepo.getById.mockResolvedValueOnce(null);

        await sut.getClientById(123).catch((err) => (expectedError = err));
      });

      it('SHOULD throw NotFoundError', async () => {
        expect(expectedError).toEqual(new NotFoundError('Cliente não encontrado!'));
      });
    });

    describe('WHEN client IS found', () => {
      let result: Client;
      beforeEach(async () => {
        clientRepo.getById.mockResolvedValueOnce(
          buildClient({
            id: 123,
          }),
        );

        result = await sut.getClientById(123);
      });

      it('SHOULD return client', () => {
        expect(result).toBeInstanceOf(Client);
      });
    });
  });

  describe(sut.create.name, () => {
    it('SHOULD call clientRepo.create with passed client', async () => {
      const client = buildClient({
        id: 123,
      });

      await sut.create(client);

      expect(clientRepo.create).toHaveBeenCalledTimes(1);
      expect(clientRepo.create).toHaveBeenCalledWith(client);
    });
  });

  describe(sut.update.name, () => {
    beforeEach(async () => {
      clientRepo.getById.mockResolvedValueOnce(
        buildClient({
          id: 123,
        }),
      );
    });
    it('SHOULD call clientRepo.update with passed client and clientId', async () => {
      const client = buildClient({
        id: 123,
      });

      await sut.update(client, 123);

      expect(clientRepo.update).toHaveBeenCalledTimes(1);
      expect(clientRepo.update).toHaveBeenCalledWith(client, 123);
    });
  });

  describe(sut.delete.name, () => {
    beforeEach(async () => {
      clientRepo.getById.mockResolvedValueOnce(
        buildClient({
          id: 123,
        }),
      );
    });
    it('SHOULD call clientRepo.delete with passed clientId', async () => {
      await sut.delete(123);

      expect(clientRepo.delete).toHaveBeenCalledTimes(1);
      expect(clientRepo.delete).toHaveBeenCalledWith(123);
    });
  });

  describe('getNewId', () => {
    it('SHOULD return lastId + 1', () => {
      clientRepo.getLastId.mockReturnValueOnce(123);

      const result = sut['getNewId']();

      expect(result).toBe(124);
    });
  });
});
