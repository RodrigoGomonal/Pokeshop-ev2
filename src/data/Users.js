//----------------------------------- Tipo de Usuarios -----------------------------------
const userType = [
    { id: 1, nombre: "Administrador", activo: true },
    { id: 2, nombre: "Vendedor", activo: true },
    { id: 3, nombre: "Cliente", activo: true }
];
//----------------------------------- Usuarios Registrados-----------------------------------
// El id esta ingresado en bruto de forma literal sin ninguna relacion con tiposDeUsuario solo por referencia
const usersList = [
    // Admin
    {
        rut: "10.456.123-K",
        nombre: "Martina",
        apellidos: "Gómez Soto",
        correo: "martina.gomez@profesor.duoc.cl",
        fecha_nac: "1980-08-10",
        clave: "123",
        telefono: "+56987654321",
        region: "Región Metropolitana",
        comuna: "Providencia",
        direccion: "Av. Manuel Montt 345",
        tipo_usuario: 1,
        activo: true
    },
    {
        rut: "15.987.654-2",
        nombre: "Javier",
        apellidos: "Rojas Pérez",
        correo: "javier.rojas@profesor.duoc.cl",
        fecha_nac: "1979-04-25",
        clave: "123",
        telefono: "+56912345678",
        region: "Región de Valparaíso",
        comuna: "Valparaíso",
        direccion: "Calle Las Dunas 101",
        tipo_usuario: 1, 
        activo: false
    },
    // Vendedor
    {
        rut: "17.111.222-3",
        nombre: "Carolina",
        apellidos: "Díaz Lagos",
        correo: "carolina.diaz@gmail.cl",
        fecha_nac: "1972-01-05",
        clave: "123",
        telefono: "+56966667777",
        region: "Región de Coquimbo",
        comuna: "La Serena",
        direccion: "Av. Del Mar 500",
        tipo_usuario: 2, 
        activo: true
    },
    {
        rut: "16.400.500-1",
        nombre: "Andrés",
        apellidos: "Sepúlveda Vera",
        correo: "andres.sepulveda@gmail.cl",
        fecha_nac: "1985-11-30",
        clave: "123",
        telefono: "+56944445555",
        region: "Región del Biobío",
        comuna: "Concepción",
        direccion: "Arturo Prat 800",
        tipo_usuario: 2, 
        activo: false
    },
    // Cliente
    {
        rut: "18.555.444-6",
        nombre: "Fernanda",
        apellidos: "Muñoz Salas",
        correo: "fernanda.m@duoc.com",
        fecha_nac: "2000-07-12",
        clave: "123",
        telefono: "+56922221111",
        region: "Región Metropolitana",
        comuna: "Maipú",
        direccion: "Pje. Los Álamos 99",
        tipo_usuario: 3, 
        activo: true
    },
    {
        rut: "19.789.012-7",
        nombre: "Roberto",
        apellidos: "Tapia Bustos",
        correo: "roberto.t@duoc.com",
        fecha_nac: "2002-03-20",
        clave: "123",
        telefono: "+56933330000",
        region: "Región de Los Lagos",
        comuna: "Puerto Montt",
        direccion: "Calle Mirador Sur 55",
        tipo_usuario: 3,
        activo: false 
    }
];
export default usersList;
export { userType, usersList };