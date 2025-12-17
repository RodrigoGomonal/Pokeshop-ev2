import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../src/components/molecules/LoginForm';
import AuthService from '../src/services/AuthService';

// Wrapper para componentes con Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Pruebas de Autenticación - LoginForm', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    
    // Resetear todos los spies
    if (AuthService.login.and) {
      AuthService.login.and.stub();
    }
    if (AuthService.logout.and) {
      AuthService.logout.and.stub();
    }
  });

  afterEach(() => {
    // Limpiar después de cada test
    localStorage.clear();
  });

  // ============================================
  // TEST: Renderizado del formulario
  // ============================================
  it('debería renderizar el formulario de login correctamente', () => {
    render(<LoginForm />, { wrapper: RouterWrapper });

    // Verificar que los campos estén presentes
    expect(screen.getByLabelText(/correo/i)).toBeTruthy();
    expect(screen.getByLabelText(/contraseña/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeTruthy();
  });

  // ============================================
  // TEST: Validación de campos vacíos
  // ============================================
  it('debería mostrar errores cuando los campos están vacíos', async () => {
    render(<LoginForm />, { wrapper: RouterWrapper });

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el correo es requerido/i)).toBeTruthy();
      expect(screen.getByText(/la contraseña es requerida/i)).toBeTruthy();
    });
  });

  // ============================================
  // TEST: Login exitoso
  // ============================================
  it('debería permitir login con credenciales válidas', async () => {
    // Spy en el método login
    spyOn(AuthService, 'login').and.returnValue(Promise.resolve({
      token: 'fake-jwt-token',
      usuario: {
        id: 1,
        rut: '12345678-9',
        nombre: 'Juan',
        correo: 'juan@duoc.cl',
        tipousuario_id: 3,
        active: true
      }
    }));

    render(<LoginForm />, { wrapper: RouterWrapper });

    const emailInput = screen.getByPlaceholderText(/juan.gonzalez@duoc.com/i);
    const passwordInput = screen.getByPlaceholderText(/1A#b/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'juan@duoc.cl' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('juan@duoc.cl', '1234');
    });
  });

  // ============================================
  // TEST: Login con credenciales incorrectas
  // ============================================
  it('debería mostrar error con credenciales incorrectas', async () => {
    spyOn(AuthService, 'login').and.returnValue(
      Promise.reject({
        response: { 
          status: 401, 
          data: { message: 'Credenciales incorrectas' } 
        }
      })
    );

    render(<LoginForm />, { wrapper: RouterWrapper });

    const emailInput = screen.getByPlaceholderText(/juan.gonzalez@duoc.com/i);
    const passwordInput = screen.getByPlaceholderText(/1A#b/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@duoc.cl' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/correo o contraseña incorrectos/i)).toBeTruthy();
    }, { timeout: 3000 });
  });

  // ============================================
  // TEST: Login con cuenta desactivada
  // ============================================
  it('debería rechazar login si la cuenta está desactivada', async () => {
    spyOn(AuthService, 'login').and.returnValue(
      Promise.reject({
        response: { 
          status: 403, 
          data: { message: 'Tu cuenta está desactivada' } 
        }
      })
    );

    render(<LoginForm />, { wrapper: RouterWrapper });

    const emailInput = screen.getByPlaceholderText(/juan.gonzalez@duoc.com/i);
    const passwordInput = screen.getByPlaceholderText(/1A#b/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'desactivado@duoc.cl' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/tu cuenta está desactivada/i)).toBeTruthy();
    }, { timeout: 3000 });
  });
});

// ============================================
// PRUEBAS DEL: AuthService
// ============================================
describe('Pruebas de AuthService', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ============================================
  // TEST: Logout limpia localStorage
  // ============================================
  it('debería limpiar localStorage al hacer logout', () => {
    // Simular sesión activa
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ nombre: 'Juan' }));

    // Verificar que existen
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).not.toBeNull();

    // Ejecutar logout
    AuthService.logout();

    // Verificar limpieza
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  // ============================================
  // TEST: getCurrentUser recupera usuario
  // ============================================
  it('debería recuperar el usuario actual de localStorage', () => {
    const mockUser = {
      id: 1,
      nombre: 'Juan',
      correo: 'juan@duoc.cl',
      tipousuario_id: 3
    };

    localStorage.setItem('user', JSON.stringify(mockUser));

    const currentUser = AuthService.getCurrentUser();

    expect(currentUser).not.toBeNull();
    expect(currentUser.nombre).toBe('Juan');
    expect(currentUser.correo).toBe('juan@duoc.cl');
  });

  // ============================================
  // TEST: isAuthenticated verifica sesión
  // ============================================
  it('debería verificar si el usuario está autenticado', () => {
    // Sin sesión
    expect(AuthService.isAuthenticated()).toBe(false);

    // Con sesión
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Test' }));

    expect(AuthService.isAuthenticated()).toBe(true);
  });
});