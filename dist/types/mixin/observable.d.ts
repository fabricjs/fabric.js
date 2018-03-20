import { IEvent } from "../fabric-sink";

export interface Observable<T> {
  /**
   * Observes specified event
   * @param eventName Event name (eg. 'after:render')
   * @param handler Function that receives a notification when an event of the specified type occurs
   */
  on(eventName: string, handler: (e: IEvent) => void): T;

  /**
   * Observes specified event
   * @param eventName Object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   */
  on(events: {[eventName: string]: (e: IEvent) => void}): T;
  /**
   * Fires event with an optional options object
   * @param eventName Event name to fire
   * @param [options] Options object
   */
  trigger(eventName: string, options?: any): T;
  /**
   * Stops event observing for a particular event handler. Calling this method
   * without arguments removes all handlers for all events
   * @param eventName Event name (eg. 'after:render') or object with key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param handler Function to be deleted from EventListeners
   */
  off(eventName?: string|any, handler?: (e: IEvent) => void): T;
}
