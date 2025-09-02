
-- Fix signup: create missing enum type and ensure trigger exists

-- 1) Create the enum type `public.user_type` if it doesn't exist
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_type') then
    create type public.user_type as enum ('talent', 'employer');
  end if;
end
$$;

-- 2) If profiles.user_type exists but isn't using the enum yet, convert it
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'user_type'
      and udt_name <> 'user_type'
  ) then
    alter table public.profiles
      alter column user_type type public.user_type
      using user_type::public.user_type;
  end if;
end
$$;

-- 3) Ensure the trigger to auto-create profiles runs after a new auth user is created
do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;
