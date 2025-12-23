
-- Create a function to execute secure SQL queries from the admin panel
create or replace function invoke_sql_query(query text)
returns jsonb
language plpgsql
security definer
as $$
declare
  result jsonb;
begin
  -- rigorous security check: ensure the user is an authenticated admin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  ) then
    raise exception 'Access denied: User is not an admin';
  end if;

  -- Execute the query and return results as JSON
  -- Note: This is powerful/dangerous. The security check above is critical.
  execute 'select json_agg(t) from (' || query || ') t' into result;
  
  -- If null (no rows), return empty array
  if result is null then
    result := '[]'::jsonb;
  end if;

  return result;
exception when others then
  -- Return error as a JSON object
  return json_build_object('error', SQLERRM, 'detail', SQLSTATE);
end;
$$;
