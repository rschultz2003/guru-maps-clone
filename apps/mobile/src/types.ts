export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
  visible: boolean;
  updatedAt: number;
};

export type IconAsset = {
  id: string;
  kind: "builtin" | "upload";
  localUri: string;
  width: number;
  height: number;
};

export type Pin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  notes: string;
  folderId: string | null;
  iconId: string;
  createdAt: number;
  updatedAt: number;
};
