
-- Create enum types
CREATE TYPE public.user_type AS ENUM ('talent', 'employer');
CREATE TYPE public.job_type AS ENUM ('full-time', 'part-time', 'contract', 'freelance', 'internship');
CREATE TYPE public.experience_level AS ENUM ('entry', 'mid', 'senior', 'executive');
CREATE TYPE public.job_status AS ENUM ('draft', 'active', 'closed', 'paused');
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewed', 'interview', 'offer', 'rejected', 'withdrawn');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  user_type user_type NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job categories table
CREATE TABLE public.job_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.job_categories(id),
  job_type job_type NOT NULL,
  experience_level experience_level NOT NULL,
  location TEXT,
  remote_allowed BOOLEAN DEFAULT false,
  salary_min INTEGER,
  salary_max INTEGER,
  currency TEXT DEFAULT 'USD',
  requirements TEXT[],
  benefits TEXT[],
  status job_status DEFAULT 'draft',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  talent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  resume_url TEXT,
  status application_status DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, talent_id)
);

-- Create saved jobs table
CREATE TABLE public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  talent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, talent_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for companies
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Employers can create companies" ON public.companies FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Company creators can update" ON public.companies FOR UPDATE USING (auth.uid() = created_by);

-- Create RLS policies for job categories
CREATE POLICY "Anyone can view job categories" ON public.job_categories FOR SELECT USING (true);

-- Create RLS policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Employers can view own jobs" ON public.jobs FOR SELECT USING (auth.uid() = employer_id);
CREATE POLICY "Employers can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);

-- Create RLS policies for job applications
CREATE POLICY "Talents can view own applications" ON public.job_applications FOR SELECT USING (auth.uid() = talent_id);
CREATE POLICY "Employers can view applications for their jobs" ON public.job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
);
CREATE POLICY "Talents can create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = talent_id);
CREATE POLICY "Talents can update own applications" ON public.job_applications FOR UPDATE USING (auth.uid() = talent_id);
CREATE POLICY "Employers can update applications for their jobs" ON public.job_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
);

-- Create RLS policies for saved jobs
CREATE POLICY "Talents can view own saved jobs" ON public.saved_jobs FOR SELECT USING (auth.uid() = talent_id);
CREATE POLICY "Talents can save jobs" ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = talent_id);
CREATE POLICY "Talents can unsave jobs" ON public.saved_jobs FOR DELETE USING (auth.uid() = talent_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, user_type, company_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::user_type, 'talent'),
    NEW.raw_user_meta_data ->> 'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample job categories
INSERT INTO public.job_categories (name, description) VALUES
('Technology', 'Software development, IT, and tech roles'),
('Marketing', 'Digital marketing, content, and advertising'),
('Sales', 'Business development and sales positions'),
('Design', 'UI/UX, graphic design, and creative roles'),
('Finance', 'Accounting, finance, and investment roles'),
('Healthcare', 'Medical, nursing, and healthcare positions'),
('Education', 'Teaching, training, and educational roles'),
('Customer Service', 'Support, service, and client relations');

-- Create indexes for better performance
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_category_id ON public.jobs(category_id);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_talent_id ON public.job_applications(talent_id);
CREATE INDEX idx_saved_jobs_talent_id ON public.saved_jobs(talent_id);
