SET @column_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'stack_items'
    AND COLUMN_NAME = 'is_active'
);

SET @alter_sql = IF(
  @column_exists = 0,
  'ALTER TABLE stack_items ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER is_main',
  'SELECT 1'
);

PREPARE alter_stmt FROM @alter_sql;
EXECUTE alter_stmt;
DEALLOCATE PREPARE alter_stmt;

UPDATE stack_items SET is_active = 1 WHERE is_active IS NULL;

INSERT INTO site_settings (key_name, value, type, label) VALUES
  ('hero_primary_cta', 'Voir projets', 'string', 'CTA principal hero'),
  ('hero_secondary_cta', 'Contact', 'string', 'CTA secondaire hero'),
  ('about_main_stack', 'React, Node.js, MySQL, Docker', 'string', 'Stack principale'),
  ('contact_title', 'Parlons de votre prochain produit web.', 'string', 'Titre contact'),
  ('contact_text', 'Disponible pour des missions freelance, des collaborations produit et des refontes ambitieuses.', 'text', 'Texte contact')
ON DUPLICATE KEY UPDATE
  value = VALUES(value),
  label = VALUES(label);
