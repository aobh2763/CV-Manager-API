import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CvEvent } from './cv.events';
import { UserRole} from '../user/user.entity';

@Injectable()
export class CvEventsService {
  private readonly eventStream = new Subject<CvEvent>();

  emit(event: CvEvent) {
    this.eventStream.next(event);
  }

  streamForUser(user: any): Observable<MessageEvent> {
    return this.eventStream.asObservable().pipe(
      filter((event) => {
        if (user.role === UserRole.ADMIN) {
          return true;
        }
        return event.ownerId === user.id;
      }),
      map((event) => {
        console.log("Emitting event for user", user.id, event);
        return new MessageEvent('cv-event', { data: event });
      }),
    );
  }
}