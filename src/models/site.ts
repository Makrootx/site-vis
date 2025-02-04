export interface Site {
  id: number;
  header: string;
  content: string;
  filePath?: string;
  location?: string;
  date?: string;
}

export interface SiteCreateDto {
  header: string;
  content: string;
  filePath?: string;
  location?: string;
  date?: string;
}
