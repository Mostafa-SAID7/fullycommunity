import { CreateNewsRequest } from './create-news-request.interface';

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {}
