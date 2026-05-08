export type CvEvent = {
  type: 'created' | 'updated' | 'deleted';
  cvId: number;
  ownerId: number;
  payload?: any;
}