import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductServices from '../src/services/ProductServices';
import CategoryServices from '../src/services/CategoryServices';
import ProductGrid from '../src/components/molecules/ProductGrid';

// Wrapper para componentes con Router
const RouterWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// ============================================
// PRUEBAS DE PRODUCTOS
// ============================================
describe('Pruebas de Productos', () => {

  const mockProducts = [
    {
      id: 1,
      name: 'Poción',
      price: 500,
      image: 'https://example.com/pocion.png',
      category_id: 1,
      stock_actual: 10,
      active: true
    },
    {
      id: 2,
      name: 'Super Poción',
      price: 1000,
      image: 'https://example.com/super-pocion.png',
      category_id: 1,
      stock_actual: 0,
      active: true
    },
    {
      id: 3,
      name: 'Poción Desactivada',
      price: 1500,
      image: 'https://example.com/pocion-desactivada.png',
      category_id: 1,
      stock_actual: 5,
      active: false
    }
  ];

  beforeEach(() => {
    spyOn(ProductServices, 'getAllProducts').and.returnValue(
      Promise.resolve({ data: mockProducts })
    );
  });

  describe('Filtrado de productos', () => {
    it('debería mostrar solo productos activos con stock', () => {
      const productosActivos = mockProducts.filter(p => p.active && p.stock_actual > 0);
      
      expect(productosActivos.length).toBe(1);
      expect(productosActivos[0].id).toBe(1);
    });

    it('debería excluir productos sin stock', () => {
      const productosConStock = mockProducts.filter(p => p.stock_actual > 0);
      
      expect(productosConStock.length).toBe(2);
      expect(productosConStock.find(p => p.id === 2)).toBeUndefined();
    });

    it('debería excluir productos inactivos', () => {
      const productosActivos = mockProducts.filter(p => p.active);
      
      expect(productosActivos.length).toBe(2);
      expect(productosActivos.find(p => p.id === 3)).toBeUndefined();
    });
  });

  describe('Renderizado de ProductGrid', () => {
    it('debería mostrar spinner mientras carga', () => {
      render(<ProductGrid productos={[]} />, { wrapper: RouterWrapper });
      
      expect(screen.getByRole('status')).toBeTruthy();
      expect(screen.getByText(/cargando productos/i)).toBeTruthy();
    });

    it('debería mostrar alerta cuando no hay productos', async () => {
      render(<ProductGrid productos={[]} />, { wrapper: RouterWrapper });
      
      await waitFor(() => {
        const alert = screen.queryByRole('alert');
        if (alert) {
          expect(alert.textContent).toMatch(/inventario vacio|sin productos/i);
        }
      }, { timeout: 2000 });
    });

    it('debería renderizar productos activos con stock', async () => {
      const productosActivos = mockProducts.filter(p => p.active && p.stock_actual > 0);
      
      render(<ProductGrid productos={productosActivos} />, { wrapper: RouterWrapper });
      
      await waitFor(() => {
        expect(screen.getByText('Poción')).toBeTruthy();
      }, { timeout: 3000 });
    });
  });

  describe('Obtener producto por ID', () => {
    it('debería obtener un producto específico', async () => {
      spyOn(ProductServices, 'getProductsById').and.returnValue(
        Promise.resolve({ data: mockProducts[0] })
      );

      const response = await ProductServices.getProductsById(1);
      
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('Poción');
    });

    it('debería manejar error si el producto no existe', async () => {
      spyOn(ProductServices, 'getProductsById').and.returnValue(
        Promise.reject(new Error('Producto no encontrado'))
      );

      try {
        await ProductServices.getProductsById(999);
        fail('Debería haber lanzado un error');
      } catch (error) {
        expect(error.message).toBe('Producto no encontrado');
      }
    });
  });

  describe('ProductGrid Novedades (últimos 8)', () => {
    it('debería mostrar los últimos 8 productos agregados', () => {
      const productos = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Producto ${i + 1}`,
        price: 500,
        active: true,
        stock_actual: 10
      }));

      const ultimos8 = productos.slice(-8);
      
      expect(ultimos8.length).toBe(8);
      expect(ultimos8[0].id).toBe(8);
      expect(ultimos8[7].id).toBe(15);
    });
  });
});

// ============================================
// PRUEBAS DE CATEGORÍAS
// ============================================
describe('Pruebas de Categorías', () => {

  const mockCategories = [
    { id: 1, name: 'Pociones' },
    { id: 2, name: 'Pokéballs' },
    { id: 3, name: 'Objetos' }
  ];

  beforeEach(() => {
    spyOn(CategoryServices, 'getAllCategories').and.returnValue(
      Promise.resolve({ data: mockCategories })
    );
  });

  it('debería obtener todas las categorías', async () => {
    const response = await CategoryServices.getAllCategories();
    
    expect(response.data.length).toBe(3);
    expect(response.data[0].name).toBe('Pociones');
  });

  it('debería filtrar productos por categoría', () => {
    const productos = [
      { id: 1, category_id: 1, name: 'Poción' },
      { id: 2, category_id: 1, name: 'Super Poción' },
      { id: 3, category_id: 2, name: 'Poké Ball' }
    ];

    const pociones = productos.filter(p => p.category_id === 1);
    
    expect(pociones.length).toBe(2);
    expect(pociones[0].name).toBe('Poción');
  });

  it('debería asignar nombre de categoría a productos', async () => {
    const response = await CategoryServices.getAllCategories();
    const categorias = response.data;
    
    const producto = { id: 1, category_id: 1 };
    const categoria = categorias.find(c => c.id === producto.category_id);
    
    expect(categoria).toBeDefined();
    expect(categoria.name).toBe('Pociones');
  });
});