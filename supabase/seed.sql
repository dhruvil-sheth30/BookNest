-- Insert test categories
INSERT INTO category (name, sub_name) VALUES
  ('Fiction', 'Novels'),
  ('Non-Fiction', 'Educational'),
  ('Science', 'Physics');

-- Insert test collections
INSERT INTO collection (name) VALUES
  ('Main Library'),
  ('Reference'),
  ('Children''s Section');

-- Insert test members
INSERT INTO member (name, email, phone) VALUES
  ('John Doe', 'john@example.com', '1234567890'),
  ('Jane Smith', 'jane@example.com', '0987654321');

-- Insert test memberships
INSERT INTO membership (member_id, status) VALUES
  ((SELECT id FROM member WHERE email = 'john@example.com'), 'active'),
  ((SELECT id FROM member WHERE email = 'jane@example.com'), 'active');

-- Insert test books
INSERT INTO book (name, category_id, collection_id, publisher, launch_date) VALUES
  ('The Great Gatsby', 
    (SELECT id FROM category WHERE name = 'Fiction'),
    (SELECT id FROM collection WHERE name = 'Main Library'),
    'Scribner', '1925-04-10'),
  ('A Brief History of Time',
    (SELECT id FROM category WHERE name = 'Science'),
    (SELECT id FROM collection WHERE name = 'Reference'),
    'Bantam Dell', '1988-01-01');

-- Insert test issuances
INSERT INTO issuance (
  book_id,
  member_id,
  issue_date,
  return_date,
  status
) VALUES
  (
    (SELECT id FROM book WHERE name = 'The Great Gatsby'),
    (SELECT id FROM member WHERE email = 'john@example.com'),
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '5 days',
    'pending'
  ); 