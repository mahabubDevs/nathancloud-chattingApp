export interface CreateEventDto {
  title: string;
  address: string;
  lat: number;
  long: number;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  role: string;
}

export interface EventResponse {
  id: string;
  image: string;
  title: string;
  address: string;
  lat: number;
  long: number;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  visibility: string;
  role: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
