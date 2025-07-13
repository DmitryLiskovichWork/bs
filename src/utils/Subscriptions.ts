export class Subscriptions {
  emitter = new EventTarget();

  subscribe = (event: 'fire', callback: (data: any) => void) => {   
    const listener = ((event: CustomEvent) => {
      callback(event.detail);
    }) as EventListener;
    
    this.emitter.addEventListener(event, listener);

    return () => this.emitter.removeEventListener(event, listener);
  }

  emit = (event: 'fire', data: any) => {
    this.emitter.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}