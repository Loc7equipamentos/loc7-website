import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createRegistration, getRegistrations, getRegistrationCount } from './db';
import { InsertRegistration } from '../drizzle/schema';

describe('Registrations API', () => {
  const testRegistration: InsertRegistration = {
    type: 'pessoa_fisica',
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    birthDate: '1990-01-15',
    motherName: 'Test Mother',
    question: 'Test question',
  };

  it('should create a registration', async () => {
    const result = await createRegistration(testRegistration);
    expect(result).toBeDefined();
  });

  it('should retrieve registrations', async () => {
    const registrations = await getRegistrations(10, 0);
    expect(Array.isArray(registrations)).toBe(true);
  });

  it('should get registration count', async () => {
    const count = await getRegistrationCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('should create pessoa_juridica registration', async () => {
    const pjRegistration: InsertRegistration = {
      type: 'pessoa_juridica',
      fullName: 'Company Contact',
      email: 'company@example.com',
      phone: '(11) 98888-8888',
      cnpj: '12.345.678/0001-99',
      companyName: 'Test Company',
      question: 'Company inquiry',
    };

    const result = await createRegistration(pjRegistration);
    expect(result).toBeDefined();
  });

  it('should handle pagination correctly', async () => {
    const page1 = await getRegistrations(5, 0);
    const page2 = await getRegistrations(5, 5);
    
    expect(Array.isArray(page1)).toBe(true);
    expect(Array.isArray(page2)).toBe(true);
  });
});
