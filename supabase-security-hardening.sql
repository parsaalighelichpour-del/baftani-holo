-- Baftani Holo: least-privilege hardening for existing public RPC functions.
-- Safe to run repeatedly. This changes function EXECUTE grants only; it does not
-- change order creation/tracking behavior or product/admin RLS policies.
-- Run in Supabase Dashboard > SQL Editor for the live project.

do $$
begin
  if to_regprocedure('public.place_store_order(text,text,jsonb,text)') is not null then
    execute 'revoke execute on function public.place_store_order(text, text, jsonb, text) from public, authenticated';
    execute 'grant execute on function public.place_store_order(text, text, jsonb, text) to anon';
  end if;

  if to_regprocedure('public.track_store_order(text,text)') is not null then
    execute 'revoke execute on function public.track_store_order(text, text) from public, authenticated';
    execute 'grant execute on function public.track_store_order(text, text) to anon';
  end if;

  if to_regprocedure('public.is_store_admin()') is not null then
    execute 'revoke execute on function public.is_store_admin() from public, anon';
    execute 'grant execute on function public.is_store_admin() to authenticated';
  end if;
end
$$;
