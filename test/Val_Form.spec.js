import React from 'react';

// ============================================
// PRUEBAS DE VALIDACIÓN DE FORMULARIOS
// ============================================
describe('Pruebas de Validación', () => {

  describe('Validación de correo electrónico', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it('debería validar correo válido', () => {
      expect(emailRegex.test('juan@duoc.cl')).toBe(true);
      expect(emailRegex.test('test@example.com')).toBe(true);
    });

    it('debería rechazar correo inválido', () => {
      expect(emailRegex.test('correo-invalido')).toBe(false);
      expect(emailRegex.test('@duoc.cl')).toBe(false);
      expect(emailRegex.test('juan@')).toBe(false);
    });
  });

  describe('Validación de RUT chileno', () => {
    const rutRegex = /^\d{7,8}-[\dkK]$/;

    it('debería validar formato de RUT', () => {
      expect(rutRegex.test('12345678-9')).toBe(true);
      expect(rutRegex.test('1234567-k')).toBe(true);
    });

    it('debería rechazar RUT inválido', () => {
      expect(rutRegex.test('12345678')).toBe(false);
      expect(rutRegex.test('123-4')).toBe(false);
    });
  });
});