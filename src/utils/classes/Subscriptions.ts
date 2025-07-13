export class Subscriptions <Events extends string>{
  emitter = new EventTarget();

  subscribe = (event: Events, callback: (data: any) => void) => {   
    const listener = ((event: CustomEvent) => {
      callback(event.detail);
    }) as EventListener;
    
    this.emitter.addEventListener(event, listener);

    return () => this.emitter.removeEventListener(event, listener);
  }

  emit = (event: Events, data: any) => {
    this.emitter.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}