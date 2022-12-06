export class CreateExperimentDto {
  name: string;
  country: string;
  country_state: string;
  doi_code: string;
  objective: string | null;
  gqm_objective: {
    objective_analyze: string;
    with_purpose: string;
    with_respect_that: string;
    with_viewpoint: string;
    in_the_context_of: string;
  } | null;
  description: string;
  reason: string;
  created_date: Date;
  has_scripts: boolean;
  has_software: boolean;
  has_source_code: boolean;
  principal_experimenter_author: string;
  constructor() {}
}
