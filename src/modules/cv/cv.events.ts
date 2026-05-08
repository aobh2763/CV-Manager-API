export interface CvEvent {
  type: 'created' | 'updated' | 'deleted';
  cvId: number;
  ownerId: number;
  payload?: any;
}