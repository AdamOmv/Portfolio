-- ============================================================
-- Portfolio ADOMV — Schema Initial
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug             VARCHAR(150) NOT NULL UNIQUE,
  title            VARCHAR(200) NOT NULL,
  subtitle         VARCHAR(300) DEFAULT NULL,
  description      TEXT         DEFAULT NULL,
  long_description LONGTEXT     DEFAULT NULL,
  cover_url        VARCHAR(500) DEFAULT NULL,
  images           JSON         DEFAULT NULL,
  tech_tags        JSON         DEFAULT NULL,
  live_url         VARCHAR(500) DEFAULT NULL,
  github_url       VARCHAR(500) DEFAULT NULL,
  status           ENUM('draft','published') NOT NULL DEFAULT 'draft',
  featured         TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order       SMALLINT     NOT NULL DEFAULT 0,
  year             YEAR         DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status   (status),
  INDEX idx_featured (featured),
  INDEX idx_sort     (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stack_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  category    ENUM('frontend','backend','devops','design','other') NOT NULL DEFAULT 'other',
  icon_slug   VARCHAR(100) DEFAULT NULL,
  proficiency TINYINT UNSIGNED NOT NULL DEFAULT 80,
  is_main     TINYINT(1) NOT NULL DEFAULT 0,
  sort_order  SMALLINT   NOT NULL DEFAULT 0,
  created_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_is_main  (is_main)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  key_name   VARCHAR(100) NOT NULL UNIQUE,
  value      TEXT         DEFAULT NULL,
  type       ENUM('string','text','json','boolean','number') NOT NULL DEFAULT 'string',
  label      VARCHAR(200) DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(200) NOT NULL,
  subject    VARCHAR(300) DEFAULT NULL,
  message    TEXT         NOT NULL,
  is_read    TINYINT(1)   NOT NULL DEFAULT 0,
  ip_address VARCHAR(45)  DEFAULT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
