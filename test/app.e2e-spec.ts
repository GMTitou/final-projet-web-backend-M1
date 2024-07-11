import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RabbitmqController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET chat/messages/:id', () => {
    return request(app.getHttpServer())
      .get('/chat/messages/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });

  it('/POST chat/send', () => {
    const message = { content: 'Hello', senderId: '1', recipientId: '2' };
    return request(app.getHttpServer())
      .post('/chat/send')
      .send(message)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.content).toBe(message.content);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
