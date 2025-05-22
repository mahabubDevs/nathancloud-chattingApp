export interface CreateEventDto {
  title: string;
  address: string;
  lat: number;
  long: number;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  role: 'PUBLIC' | 'PRIVATE';
}

export interface EventResponse {
  id: string;
  image: string;
  title: string;
  address: string;
  lat: number;
  long: number;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  role: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
