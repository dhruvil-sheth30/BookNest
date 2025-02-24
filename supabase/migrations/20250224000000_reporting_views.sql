-- 1. Books never borrowed
CREATE OR REPLACE VIEW books_never_borrowed AS
SELECT 
  b.id,
  b.name as book_name,
  b.publisher as author,
  c.name as category,
  col.name as collection
FROM book b
LEFT JOIN issuance i ON b.id = i.book_id
LEFT JOIN category c ON b.category_id = c.id
LEFT JOIN collection col ON b.collection_id = col.id
WHERE i.id IS NULL;

-- 2. Outstanding books
CREATE OR REPLACE VIEW outstanding_books AS
SELECT 
  i.id as issuance_id,
  m.name as member_name,
  b.name as book_name,
  i.issue_date,
  i.return_date as target_return_date,
  b.publisher as author,
  CASE 
    WHEN i.return_date < CURRENT_DATE THEN 'overdue'
    ELSE 'pending'
  END as status
FROM issuance i
JOIN member m ON i.member_id = m.id
JOIN book b ON i.book_id = b.id
WHERE i.status = 'pending'
ORDER BY i.return_date;

-- 3. Top 10 most borrowed books
CREATE OR REPLACE VIEW top_borrowed_books AS
SELECT 
  b.id,
  b.name as book_name,
  COUNT(i.id) as times_borrowed,
  COUNT(DISTINCT i.member_id) as unique_borrowers,
  b.publisher as author,
  c.name as category,
  col.name as collection
FROM book b
JOIN issuance i ON b.id = i.book_id
LEFT JOIN category c ON b.category_id = c.id
LEFT JOIN collection col ON b.collection_id = col.id
GROUP BY b.id, b.name, b.publisher, c.name, col.name
ORDER BY times_borrowed DESC, unique_borrowers DESC
LIMIT 10; 