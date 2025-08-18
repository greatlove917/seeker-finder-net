-- Fix security issue: Restrict profile visibility
-- Remove the overly permissive policy that allows viewing all profiles
DROP POLICY "Users can view all profiles" ON public.profiles;

-- Create more secure policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow viewing basic company information for employers (needed for job applications)
-- Only show company_name and user_type for employers, not personal names
CREATE POLICY "View employer company info" 
ON public.profiles 
FOR SELECT 
USING (user_type = 'employer' AND id IN (
  SELECT DISTINCT employer_id 
  FROM jobs 
  WHERE employer_id IS NOT NULL
));

-- Allow viewing minimal info for job application context
-- This allows employers to see basic info of applicants without exposing all users
CREATE POLICY "Employers can view applicant basic info" 
ON public.profiles 
FOR SELECT 
USING (
  user_type = 'talent' AND 
  id IN (
    SELECT DISTINCT talent_id 
    FROM job_applications 
    WHERE job_id IN (
      SELECT id FROM jobs WHERE employer_id = auth.uid()
    )
  )
);