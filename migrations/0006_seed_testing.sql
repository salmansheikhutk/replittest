-- Seed testing table with initial data
INSERT INTO testing (name, description, value) VALUES
('Alpha', 'First test record', 10),
('Beta', 'Second test record', 42),
('Gamma', 'Third test record', 99),
('Delta', 'Fourth test record', 7)
ON CONFLICT DO NOTHING;
