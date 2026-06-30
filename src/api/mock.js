/**
 * Base de datos simulada de clientes para modo 'mock'.
 * Replica la forma exacta de una respuesta OData de Creatio
 * sobre la entidad Contact con campos Usr personalizados.
 */
export const MOCK_DB = {
  '20100017491': {
    Name: 'Telefónica del Perú S.A.A.',
    Email: 'contacto@telefonica.com.pe',
    UsrGender: 'Persona Jurídica',
    UsrAge: 32
  },
  '10408765432': {
    Name: 'María Elena García Ramos',
    Email: 'maria.garcia@correo.pe',
    UsrGender: 'Femenino',
    UsrAge: 34
  },
  '20512345678': {
    Name: 'Distribuidora Andina S.A.C.',
    Email: 'ventas@distandina.com.pe',
    UsrGender: 'Persona Jurídica',
    UsrAge: 8
  },
  '10456789012': {
    Name: 'Carlos Alberto Mendoza Vega',
    Email: 'c.mendoza@gmail.com',
    UsrGender: 'Masculino',
    UsrAge: 41
  }
};
