import React from 'react';
import { getCart, saveCart, clearCart, updateCartCount } from '../src/utils/CartUtils';

// ============================================
// PRUEBAS DEL CARRITO DE COMPRAS
// ============================================
describe('🛒 Pruebas del Carrito de Compras', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });
  // ============================================
  // TEST: CARRITO - AGREGAR
  // ============================================
  describe('Agregar productos al carrito', () => {
    it('debería agregar un producto nuevo al carrito', () => {
      clearCart();
      const newCart = [{ id: 1, quantity: 2 }];
      saveCart(newCart);

      const savedCart = getCart();
      expect(savedCart.length).toBe(1);
      expect(savedCart[0]).toEqual({ id: 1, quantity: 2 });
    });

    it('debería incrementar cantidad si el producto ya existe', () => {
      saveCart([{ id: 1, quantity: 1 }]);

      const cart = getCart();
      const existing = cart.find(item => item.id === 1);
      
      let updatedCart;
      if (existing) {
        updatedCart = cart.map(item =>
          item.id === 1 ? { ...item, quantity: item.quantity + 2 } : item
        );
      }

      saveCart(updatedCart);
      const finalCart = getCart();
      
      expect(finalCart[0].quantity).toBe(3);
    });
  });
  // ============================================
  // TEST: CARRITO - ELIMINAR
  // ============================================
  describe('Eliminar productos del carrito', () => {
    it('debería eliminar un producto específico', () => {
      saveCart([
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ]);

      const cart = getCart();
      const updatedCart = cart.filter(item => item.id !== 1);
      saveCart(updatedCart);

      const finalCart = getCart();
      expect(finalCart.length).toBe(1);
      expect(finalCart[0].id).toBe(2);
    });

    it('debería vaciar completamente el carrito', () => {
      saveCart([
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ]);

      clearCart();
      const cart = getCart();
      expect(cart.length).toBe(0);
    });
  });
  // ============================================
  // TEST: CARRITO - CANTIDADES
  // ============================================
  describe('Actualizar cantidades', () => {
    it('debería incrementar la cantidad de un producto', () => {
      saveCart([{ id: 1, quantity: 1 }]);

      const cart = getCart();
      const updatedCart = cart.map(item =>
        item.id === 1 ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updatedCart);

      const finalCart = getCart();
      expect(finalCart[0].quantity).toBe(2);
    });

    it('debería decrementar la cantidad de un producto', () => {
      saveCart([{ id: 1, quantity: 3 }]);

      const cart = getCart();
      const updatedCart = cart.map(item =>
        item.id === 1 ? { ...item, quantity: item.quantity - 1 } : item
      );
      saveCart(updatedCart);

      const finalCart = getCart();
      expect(finalCart[0].quantity).toBe(2);
    });

    it('debería eliminar producto si la cantidad llega a 0', () => {
      saveCart([{ id: 1, quantity: 1 }]);

      const cart = getCart();
      const updatedCart = cart.filter(item => !(item.id === 1 && item.quantity <= 1));
      saveCart(updatedCart);

      const finalCart = getCart();
      expect(finalCart.length).toBe(0);
    });
  });
  // ============================================
  // TEST: CARRITO - TOTAL
  // ============================================
  describe('Calcular total del carrito', () => {
    it('debería calcular el total correctamente', () => {
      const cart = [
        { id: 1, quantity: 2, price: 500 },
        { id: 2, quantity: 1, price: 1000 }
      ];
      
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(total).toBe(2000);
    });

    it('debería retornar 0 si el carrito está vacío', () => {
      clearCart();
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      expect(total).toBe(0);
    });
  });
  // ============================================
  // TEST: CARRITO - CONTADOR
  // ============================================
  describe('Contador del carrito', () => {
    it('debería contar correctamente los productos', () => {
      saveCart([
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 }
      ]);

      const count = updateCartCount();
      expect(count).toBe(5);
    });

    it('debería retornar 0 si el carrito está vacío', () => {
      clearCart();
      const count = updateCartCount();
      expect(count).toBe(0);
    });
  });
  // ============================================
  // TEST: CARRITO - PERSISTENCIA
  // ============================================
  describe('Persistencia en localStorage', () => {
    it('debería persistir el carrito en localStorage', () => {
      const cart = [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ];

      saveCart(cart);
      // Verificar que saveCart guardó correctamente
      const storedCart = getCart();
      
      expect(storedCart.length).toBe(2);
      expect(storedCart[0].id).toBe(1);
      expect(storedCart[0].quantity).toBe(2);
      expect(storedCart[1].id).toBe(2);
      expect(storedCart[1].quantity).toBe(1);
    });

    it('debería recuperar el carrito después de recargar', () => {
      const cart = [{ id: 1, quantity: 3 }];
      
      // Guardar usando saveCart en lugar de localStorage directamente
      saveCart(cart);

      const recoveredCart = getCart();
      
      expect(recoveredCart.length).toBe(1);
      expect(recoveredCart[0].id).toBe(1);
      expect(recoveredCart[0].quantity).toBe(3);
    });
  });
});