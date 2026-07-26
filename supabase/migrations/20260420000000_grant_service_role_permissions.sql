-- Grant explicit table privileges to service_role for backend tasks and tests
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
