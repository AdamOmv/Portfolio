INSERT INTO site_settings (key_name, value, type, label) VALUES
  ('logo_url', '', 'string', 'Logo header (URL)'),
  ('favicon_url', '/favicon.svg', 'string', 'Favicon URL')
ON DUPLICATE KEY UPDATE
  value = VALUES(value),
  label = VALUES(label);

