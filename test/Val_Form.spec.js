import React from 'react';
import { formatearRut, validarRut, validarCorreo, validarTelefono } from '../src/utils/UserUtils';

describe('Pruebas de Validación', () => {

  // -------------------------
  // TEST: formatearRut
  // -------------------------
  describe('formatearRut', () => {
    it('debe formatear un RUT correctamente', () => {
      expect(formatearRut('12345678K')).toBe('12.345.678-K');
    });

    it('debe eliminar caracteres inválidos', () => {
      expect(formatearRut('12.345.678-k')).toBe('12.345.678-K');
    });

    it('debe retornar el mismo valor si es muy corto', () => {
      expect(formatearRut('1')).toBe('1');
    });
  });

  // -------------------------
  // TEST: validarRut
  // -------------------------
  describe('validarRut', () => {
    it('debe validar un RUT correcto', () => {
      expect(validarRut('12.345.678-5')).toBeTrue();
    });

    it('debe aceptar RUT sin puntos ni guión', () => {
      expect(validarRut('123456785')).toBeTrue();
    });

    it('debe rechazar un RUT incorrecto', () => {
      expect(validarRut('12.345.678-9')).toBeFalse();
    });

    it('debe rechazar RUT con longitud inválida', () => {
      expect(validarRut('1')).toBeFalse();
    });
  });

  // -------------------------
  // TEST: validarCorreo
  // -------------------------
  describe('validar Correo', () => {
    it('debe aceptar correo duoc.cl', () => {
      expect(validarCorreo('usuario@duoc.cl')).toBeTrue();
    });

    it('debe aceptar correo profesor.duoc.cl', () => {
      expect(validarCorreo('docente@profesor.duoc.cl')).toBeTrue();
    });

    it('debe aceptar correo gmail.com', () => {
      expect(validarCorreo('test@gmail.com')).toBeTrue();
    });

    it('debe rechazar correos no permitidos', () => {
      expect(validarCorreo('test@yahoo.com')).toBeFalse();
    });
  });

  // -------------------------
  // TEST: validarTelefono
  // -------------------------
  describe('validarTelefono', () => {
    it('debe aceptar teléfono chileno válido', () => {
      expect(validarTelefono('+56912345678')).toBeTrue();
    });

    it('debe rechazar teléfono sin código país', () => {
      expect(validarTelefono('912345678')).toBeFalse();
    });

    it('debe rechazar teléfono con formato incorrecto', () => {
      expect(validarTelefono('+56812345678')).toBeFalse();
    });
  });

});