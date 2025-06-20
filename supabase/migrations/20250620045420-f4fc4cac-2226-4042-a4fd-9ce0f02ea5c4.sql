
-- Create RLS policies for anonymous survey responses
-- Allow anonymous users to insert survey responses
CREATE POLICY "Allow anonymous survey submissions" 
  ON public.survey_responses 
  FOR INSERT 
  WITH CHECK (participant_id IS NULL);

-- Allow admins to view all survey responses
CREATE POLICY "Admins can view all survey responses" 
  ON public.survey_responses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'researcher')
    )
  );

-- Allow admins to update survey responses if needed
CREATE POLICY "Admins can update survey responses" 
  ON public.survey_responses 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'researcher')
    )
  );

-- Allow admins to delete survey responses if needed
CREATE POLICY "Admins can delete survey responses" 
  ON public.survey_responses 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'researcher')
    )
  );
