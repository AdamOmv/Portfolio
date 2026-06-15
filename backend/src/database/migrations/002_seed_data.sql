-- ============================================================
-- Portfolio ADOMV — Seed Data
-- ============================================================

INSERT INTO site_settings (key_name, value, type, label) VALUES
  ('site_title',        'Adomv — Full-Stack Developer',  'string',  'Titre du site'),
  ('hero_name',         'Adam Oumarov',                  'string',  'Nom hero'),
  ('hero_tagline',      'I build things for the web.',   'string',  'Tagline hero'),
  ('hero_description',  'Développeur Full-Stack spécialisé React & Node.js. Je transforme des idées complexes en interfaces propres et des architectures robustes.', 'text', 'Description hero'),
  ('about_text',        'Développeur Full-Stack basé en France, je conçois et réalise des applications web de A à Z — du design système à l''infrastructure. Mon approche : du code propre, des interfaces soignées, une architecture qui tient dans le temps.\n\nJe travaille principalement avec React et Node.js, avec une attention particulière à la performance et à l''expérience utilisateur.', 'text', 'Texte about'),
  ('about_specialty',   'Full-Stack Development',        'string',  'Spécialité'),
  ('about_approach',    'Clean code, scalable architecture, pixel-perfect UI.', 'text', 'Approche'),
  ('github_url',        'https://github.com/adomv',      'string',  'Lien GitHub'),
  ('linkedin_url',      '',                              'string',  'Lien LinkedIn'),
  ('twitter_url',       '',                              'string',  'Lien Twitter'),
  ('email_contact',     'contact@adomv.com',             'string',  'Email de contact'),
  ('cv_url',            '',                              'string',  'URL du CV PDF'),
  ('years_experience',  '3',                             'number',  'Années d''expérience'),
  ('footer_text',       'Conçu et développé par Adam Oumarov.', 'string', 'Texte footer'),
  ('maintenance_mode',  'false',                         'boolean', 'Mode maintenance')
ON DUPLICATE KEY UPDATE label = VALUES(label);

INSERT INTO stack_items (name, category, icon_slug, proficiency, is_main, sort_order) VALUES
  ('React',       'frontend', 'react',      90, 1, 1),
  ('TypeScript',  'frontend', 'typescript', 85, 1, 2),
  ('Tailwind CSS','frontend', 'tailwindcss',90, 1, 3),
  ('Node.js',     'backend',  'nodejs',     88, 1, 4),
  ('Express',     'backend',  'express',    88, 0, 5),
  ('MySQL',       'backend',  'mysql',      80, 1, 6),
  ('Symfony',     'backend',  'symfony',    75, 0, 7),
  ('PHP',         'backend',  'php',        75, 0, 8),
  ('Docker',      'devops',   'docker',     80, 1, 9),
  ('Git',         'devops',   'git',        90, 0, 10),
  ('GitHub',      'devops',   'github',     90, 0, 11),
  ('Nginx',       'devops',   'nginx',      70, 0, 12),
  ('Figma',       'design',   'figma',      75, 0, 13),
  ('Vite',        'frontend', 'vite',       85, 0, 14)
ON DUPLICATE KEY UPDATE sort_order = VALUES(sort_order);
