export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  createdAt: string;
}

export interface TagSettings {
  selectedTags: Tag[];
}
