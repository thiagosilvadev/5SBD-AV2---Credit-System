-- Seeder for generating fake data

-- Generate random UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert businesses
INSERT INTO business (id, name, cnpj)
VALUES (uuid_generate_v4(), 'Business 1', '12345678901234'),
       (uuid_generate_v4(), 'Business 2', '56789012345678');

-- Insert employees
INSERT INTO employee (id, name, cpf, businessId, salary)
VALUES (uuid_generate_v4(), 'Employee 1', '12345678901', (SELECT id FROM business WHERE name = 'Business 1'), 5000),
       (uuid_generate_v4(), 'Employee 2', '23456789012', (SELECT id FROM business WHERE name = 'Business 1'), 6000),
       (uuid_generate_v4(), 'Employee 3', '34567890123', (SELECT id FROM business WHERE name = 'Business 2'), 7000),
       (uuid_generate_v4(), 'Employee 4', '45678901234', (SELECT id FROM business WHERE name = 'Business 2'), 8000);

-- Insert sellers
INSERT INTO seller (id, name)
VALUES (uuid_generate_v4(), 'Seller 1'),
       (uuid_generate_v4(), 'Seller 2');

-- Insert contracts
INSERT INTO contract (id, value, payValue, totalInstallments, sellerId, employeeId)
VALUES (uuid_generate_v4(), 10000, 5000, 12, (SELECT id FROM seller WHERE name = 'Seller 1'), (SELECT id FROM employee WHERE name = 'Employee 1')),
       (uuid_generate_v4(), 20000, 10000, 24, (SELECT id FROM seller WHERE name = 'Seller 1'), (SELECT id FROM employee WHERE name = 'Employee 2')),
       (uuid_generate_v4(), 15000, 7500, 18, (SELECT id FROM seller WHERE name = 'Seller 2'), (SELECT id FROM employee WHERE name = 'Employee 3')),
       (uuid_generate_v4(), 30000, 15000, 36, (SELECT id FROM seller WHERE name = 'Seller 2'), (SELECT id FROM employee WHERE name = 'Employee 4'));

-- Insert guarantees
INSERT INTO garanty (id, description, value, contractId)
VALUES (uuid_generate_v4(), 'Guarantee 1', 5000, (SELECT id FROM contract LIMIT 1)),
       (uuid_generate_v4(), 'Guarantee 2', 10000, (SELECT id FROM contract LIMIT 1 OFFSET 1)),
       (uuid_generate_v4(), 'Guarantee 3', 7500, (SELECT id FROM contract LIMIT 1 OFFSET 2)),
       (uuid_generate_v4(), 'Guarantee 4', 15000, (SELECT id FROM contract LIMIT 1 OFFSET 3));

-- Insert payments
INSERT INTO payment (id, value, dueDate, paidDate, contractId)
VALUES (uuid_generate_v4(), 1000, NOW() + INTERVAL '1 month', NOW(), (SELECT id FROM contract LIMIT 1)),
       (uuid_generate_v4(), 2000, NOW() + INTERVAL '2 months', NOW(), (SELECT id FROM contract LIMIT 1 OFFSET 1)),
       (uuid_generate_v4(), 1500, NOW() + INTERVAL '3 months', NULL, (SELECT id FROM contract LIMIT 1 OFFSET 2)),
       (uuid_generate_v4(), 3000, NOW() + INTERVAL '4 months', NULL, (SELECT id FROM contract LIMIT 1 OFFSET 3));
