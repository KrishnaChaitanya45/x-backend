export type CreateCommunity = {
  name: string;
  description: string;
  bg_image?: string;
  rules?: string[];
  icon?: string;
  moderators: string[];
  members?: string[];
  tags?: string[];
  unique_name: string;
};
