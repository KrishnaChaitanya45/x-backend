export type CREATE_INSTRUCTOR_DTO = {
  user_name: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  skills?: string[];
  profilePhoto: string;
  work_experience?: workExperience[];
  education?: string;
  phone_number: string;
  achievements?: achievements[];
  socials?: socials[];
};

export type LOGIN_INSTRUCTOR_DTO = {
  email: string;
  password: string;
};

type workExperience = {
  years: number;
  role: string;
  location: string;
  description: string[];
  organization: string;
};

type achievements = {
  title: string;
  link?: string;
  description?: string;
  media?: string;
};

type socials = {
  platform_name: string;
  link: string;
  user_name: string;
};
