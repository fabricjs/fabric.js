import { describe, it, expect } from 'vitest';
import { Observable } from './Observable';

type AnyEventsSpec = Record<PropertyKey, unknown>;

describe('Observable', () => {
  it('exists with expected methods', () => {
    const o = new Observable<AnyEventsSpec>();
    expect(typeof o.fire === 'function').toBeTruthy();
    expect(typeof o.on === 'function').toBeTruthy();
    expect(typeof o.once === 'function').toBeTruthy();
    expect(typeof o.off === 'function').toBeTruthy();
  });

  it('fires events with on method', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false;
    foo.on('bar:baz', () => {
      eventFired = true;
    });

    foo.fire('bar:baz');
    expect(eventFired).toBe(true);
  });

  it('fires events only once with once method', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = 0;
    foo.once('bar:baz', () => {
      eventFired++;
    });

    foo.fire('bar:baz');
    expect(eventFired).toBe(1);
    foo.fire('bar:baz');
    expect(eventFired).toBe(1);
  });

  it('maintains correct context when using once', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false;
    let context: Observable<AnyEventsSpec>;
    foo.once('bar:baz', function (this: Observable<AnyEventsSpec>) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- fine for testing
      context = this;
      eventFired = true;
    });

    foo.fire('bar:baz');
    expect(eventFired).toBe(true);
    expect(context!).toBe(foo);
  });

  it('registers multiple once handlers correctly', () => {
    const foo = new Observable<AnyEventsSpec>();
    let eventFired = 0;
    let eventFired2 = 0;
    let eventFired3 = 0;
    const eventData = { a: 'b', c: 'd' };

    foo.once({
      'bar:baz': () => {
        eventFired++;
      },
      'blah:blah': () => {
        eventFired2++;
      },
      'blah:blah:bloo': (e) => {
        eventFired3++;
        expect(e).toEqual(eventData);
        expect(e).toBe(eventData);
      },
    });

    foo.fire('bar:baz');
    expect(eventFired).toBe(1);
    expect(eventFired2).toBe(0);

    foo.fire('blah:blah');
    expect(eventFired).toBe(1);
    expect(eventFired2).toBe(1);

    foo.fire('bar:baz');
    foo.fire('blah:blah');
    expect(eventFired).toBe(1);
    expect(eventFired2).toBe(1);
    expect(eventFired3).toBe(0);

    foo.fire('blah:blah:bloo', eventData);
  });

  it('unbinds events with off method', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false;
    const handler = () => {
      eventFired = true;
    };

    foo.on('bar:baz', handler);
    foo.off('bar:baz', handler);

    foo.fire('bar:baz');
    expect(eventFired).toBe(false);
  });

  it('unbinds all event handlers when off is called without handler', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false,
      event2Fired = false;

    const handler = () => {
      eventFired = true;
    };
    const handler2 = () => {
      event2Fired = true;
    };

    foo.on('bar:baz', handler);
    foo.on('bar:baz', handler2);

    foo.off('bar:baz');

    foo.fire('bar:baz');
    expect(eventFired).toBe(false);
    expect(event2Fired).toBe(false);

    foo.on('bar:baz', handler);
    foo.on('bar:baz', handler2);

    foo.off({ 'bar:baz': undefined });

    foo.fire('bar:baz');
    expect(eventFired).toBe(false);
    expect(event2Fired).toBe(false);
  });

  it('unbinds multiple event handlers', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false,
      event2Fired = false;

    const handler = () => {
      eventFired = true;
    };
    const handler2 = () => {
      event2Fired = true;
    };

    foo.on({ 'bar:baz': handler, 'blah:blah': handler2 });
    foo.off({ 'bar:baz': handler, 'blah:blah': handler2 });

    foo.fire('bar:baz');
    expect(eventFired).toBe(false);

    foo.fire('blah:blah');
    expect(event2Fired).toBe(false);
  });

  it('unbinds all events when off is called with no arguments', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false,
      event2Fired = false;

    const handler = () => {
      eventFired = true;
    };
    const handler2 = () => {
      event2Fired = true;
    };

    foo.on({ 'bar:baz': handler, 'blah:blah': handler2 });
    foo.off();

    foo.fire('bar:baz');
    expect(eventFired).toBe(false);

    foo.fire('blah:blah');
    expect(event2Fired).toBe(false);
  });

  it('binds multiple event handlers with object syntax', () => {
    const foo = new Observable<AnyEventsSpec>();

    let barBazFired = false;
    let blahBlahFired = false;
    let mooFired = false;

    foo.on({
      'bar:baz': () => {
        barBazFired = true;
      },
      'blah:blah': () => {
        blahBlahFired = true;
      },
      moo: () => {
        mooFired = true;
      },
    });

    foo.fire('bar:baz');
    foo.fire('blah:blah');
    foo.fire('moo');

    expect(barBazFired).toBe(true);
    expect(blahBlahFired).toBe(true);
    expect(mooFired).toBe(true);
  });

  it('passes event options to handlers', () => {
    const foo = new Observable<{ 'foo:bar': { value: string } }>();

    let someValue;
    foo.on('foo:bar', (e) => {
      someValue = e.value;
    });

    foo.fire('foo:bar', { value: 'sekret' });

    expect(someValue).toBe('sekret');
  });

  it('maintains correct context when firing events', () => {
    const foo = new Observable<AnyEventsSpec>();

    let eventFired = false;
    let context: Observable<AnyEventsSpec>;

    foo.on('bar:baz', function (this: Observable<AnyEventsSpec>) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- fine for testing
      context = this;
      eventFired = true;
    });

    foo.fire('bar:baz');
    expect(eventFired).toBe(true);
    expect(context!).toBe(foo);
  });

  it('correctly handles removal of events during event execution', () => {
    const foo = new Observable<AnyEventsSpec>();
    let event1Fired = false,
      event2Fired = false;
    let event3Fired = false,
      event4Fired = false;

    const handler1 = function () {
      event1Fired = true;
      foo.off('bar:baz', handler1);
    };
    const handler2 = function () {
      event2Fired = true;
    };
    const handler3 = function () {
      event3Fired = true;
    };
    const handler4 = function () {
      event4Fired = true;
    };

    foo.on('bar:baz', handler1);
    foo.on('bar:baz', handler2);
    foo.on('bar:baz', handler3);
    foo.on('bar:baz', handler4);

    expect(
      // @ts-expect-error -- private method
      foo.__eventListeners['bar:baz'].length,
      'There should be 4 events registered now',
    ).toBe(4);

    foo.fire('bar:baz');

    expect(
      // @ts-expect-error -- private method
      foo.__eventListeners['bar:baz'].length,
      'There should be 3 events registered now',
    ).toBe(3);
    expect(event1Fired, 'Event 1 should fire').toBe(true);
    expect(
      // @ts-expect-error -- private method
      foo.__eventListeners['bar:baz'],
      'There should be 3 events registered now',
    ).toEqual([handler2, handler3, handler4]);
    expect(event2Fired, 'Event 2 should fire').toBe(true);
    expect(event3Fired, 'Event 3 should fire').toBe(true);
    expect(event4Fired, 'Event 4 should fire').toBe(true);
  });

  it('correctly handles removal of events in inner loop', () => {
    const foo = new Observable<AnyEventsSpec>();
    let event1Fired = 0,
      event2Fired = 0;
    let event3Fired = 0,
      event4Fired = 0;

    const handler1 = function () {
      event1Fired++;
      foo.off('bar:baz', handler1);
      expect(
        // @ts-expect-error -- private method
        foo.__eventListeners['bar:baz'].length,
        'There should be 3 handlers registered',
      ).toBe(3);
      expect(
        // @ts-expect-error -- private method
        foo.__eventListeners['bar:baz'],
        'There should be 3 handlers registered',
      ).toEqual([handler2, handler3, handler4]);
      expect(event1Fired, 'Event 1 should fire once').toBe(1);
      expect(event2Fired, 'Event 2 should not be fired yet').toBe(0);
      expect(event3Fired, 'Event 3 should not be fired yet').toBe(0);
      expect(event4Fired, 'Event 4 should not be fired yet').toBe(0);
      foo.fire('bar:baz');
      expect(
        // @ts-expect-error -- private method
        foo.__eventListeners['bar:baz'].length,
        'There should be 3 handlers registered now',
      ).toBe(3);
    };
    const handler2 = function () {
      event2Fired++;
    };
    const handler3 = function () {
      event3Fired++;
    };
    const handler4 = function () {
      event4Fired++;
    };

    foo.on('bar:baz', handler1);
    foo.on('bar:baz', handler2);
    foo.on('bar:baz', handler3);
    foo.on('bar:baz', handler4);

    foo.fire('bar:baz');

    expect(event1Fired, 'Event 1 should fire once').toBe(1);
    expect(event2Fired, 'Event 2 should fire twice').toBe(2);
    expect(event3Fired, 'Event 3 should fire twice').toBe(2);
    expect(event4Fired, 'Event 4 should fire twice').toBe(2);
  });

  it('allows adding events during event execution', () => {
    const foo = new Observable<AnyEventsSpec>();
    let event1Fired = false,
      event2Fired = false;
    let event3Fired = false,
      event4Fired = false;

    const handler1 = function () {
      event1Fired = true;
      foo.off('bar:baz', handler1);
      foo.on('bar:baz', handler3);
      foo.on('bar:baz', handler4);
    };
    const handler2 = function () {
      event2Fired = true;
    };
    const handler3 = function () {
      event3Fired = true;
    };
    const handler4 = function () {
      event4Fired = true;
    };

    foo.on('bar:baz', handler1);
    foo.on('bar:baz', handler2);

    foo.fire('bar:baz');

    expect(event1Fired, 'Event 1 should fire').toBe(true);
    expect(event2Fired, 'Event 2 should fire').toBe(true);
    expect(event3Fired, 'Event 3 should not fire').toBe(false);
    expect(event4Fired, 'Event 4 should not fire').toBe(false);

    foo.fire('bar:baz');

    expect(event3Fired, 'Event 3 should be fired now').toBe(true);
    expect(event4Fired, 'Event 4 should be fired now').toBe(true);
  });

  it('properly handles disposing of event handlers', () => {
    const foo = new Observable<AnyEventsSpec>();

    const fired = new Array(7).fill(false);

    const getEventName = function (index: number) {
      return `event${index + 1}`;
    };

    const createHandler = function (index: number) {
      return function () {
        fired[index] = true;
      };
    };

    const attach = function () {
      return [
        foo.on(getEventName(0), createHandler(0)),
        foo.on(getEventName(1), createHandler(1)),
        foo.once(getEventName(2), createHandler(2)),
        foo.on({
          [getEventName(3)]: createHandler(3),
          [getEventName(4)]: createHandler(4),
        }),
        foo.once({
          [getEventName(5)]: createHandler(5),
          [getEventName(6)]: createHandler(6),
        }),
      ];
    };

    let disposers: (() => void)[] = [];

    const fireAll = function () {
      fired.forEach(function (__, index) {
        foo.fire(getEventName(index));
      });
    };

    const dispose = function () {
      disposers.forEach(function (disposer) {
        disposer();
      });
    };

    // dispose before firing
    disposers = attach();
    dispose();
    fireAll();
    expect(fired).toEqual(new Array(fired.length).fill(false));

    // dispose after firing
    disposers = attach();
    fireAll();
    expect(fired).toEqual(new Array(fired.length).fill(true));
    fired.fill(false);
    dispose();
    fireAll();
    expect(fired).toEqual(new Array(fired.length).fill(false));
  });
});
