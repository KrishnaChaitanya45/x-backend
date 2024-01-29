export type CREATE_COURSE_DTO = {
  name: string;
  description: string;
  cost: number;
  unique_name: string;
  instructor: string[];
  tags: string[];
  rewards: [];
  level: object;
  icon?: string;
  bg_image?: string;
  skills: string[];
};
