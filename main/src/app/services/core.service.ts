import { Injectable, signal } from '@angular/core';
import { AppSettings, defaults } from '../config';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class CoreService {
    private optionsSignal = signal<AppSettings>(defaults);

    getOptions() {
        return this.optionsSignal();
    }

    setOptions(options: Partial<AppSettings>) {
        this.optionsSignal.update((current) => ({
            ...current,
            ...options,
        }));
    }

      private messageSource = new BehaviorSubject<string>('Default Message');
      currentMessage = this.messageSource.asObservable();
    
      changeMessage(message: string) {
        this.messageSource.next(message);
      }

}
