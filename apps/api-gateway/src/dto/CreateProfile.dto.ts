export class CreateProfileDTO {
  first_name: string;
  last_name: string;
  location: string;
  education: string;
  socials: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  interests: string[];
  //WorkEx
  work_experience?: {
    company: string;
    startDate: Date;
    endDate: Date;
    role: string;
  };
  //Achievements
  achievements?: {
    title: string;
    description: string;
    date: Date;
  };
  //Skills
  skills?: string[];
}
