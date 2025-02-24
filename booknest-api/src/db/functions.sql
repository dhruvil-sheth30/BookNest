-- Create function for most borrowed books
CREATE OR REPLACE FUNCTION get_most_borrowed_books()
RETURNS TABLE (
  book_name TEXT,
  times_borrowed BIGINT,
  unique_members BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.name as book_name,
    COUNT(i.id) as times_borrowed,
    COUNT(DISTINCT i.member_id) as unique_members
  FROM book b
  LEFT JOIN issuance i ON b.id = i.book_id
  GROUP BY b.id, b.name
  ORDER BY COUNT(i.id) DESC;
END;
$$ LANGUAGE plpgsql; 