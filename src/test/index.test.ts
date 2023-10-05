import SmartPostMessage from '../index';

type SonObserveMap = {
  'getSonUserId': (id: string) => string;
}

type ParentObserveMap = {
  'getParentUserId': (id: string) => string;
}

type ParentNotifyMap = {
  'parentNotifyBoolean': { joined: boolean };
}

type SonNotifyMap = {
  'sonNotifyStr': string;
}

type SSMap = {
  'sonJoined': { joined: boolean };
}

const timeout = 2;

describe('SmartPostMessage Test Connection', () => {
  let Parent: SmartPostMessage<SonNotifyMap, ParentObserveMap, SonObserveMap, ParentNotifyMap>;
  let Son: SmartPostMessage<ParentNotifyMap, SonObserveMap, ParentObserveMap, SonNotifyMap>;

  beforeEach(() => {
    const iframe = window.document.createElement('iframe');
    window.document.body.appendChild(iframe);
    if (!iframe.contentWindow) {
      throw new Error('no iframe content');
    }

    const iframeWindow = iframe.contentWindow;

    // Create instances of SmartPostMessage for the parent and iframe windows
    Parent = new SmartPostMessage({
      currentWindow: window,
      targetWindow: iframeWindow,
      targetOrigin: '*',
    });

    Son = new SmartPostMessage({
      currentWindow: iframeWindow,
      targetWindow: window,
      targetOrigin: '*',
    });
  });

  test('should establish a connection', async () => {
    const [
      parentEstablished,
      iframeEstablished,
    ] = await Promise.all([
      Parent.establish(true),
      Son.establish(false),
    ])

    // Assertions
    expect(parentEstablished).toBe(1);
    expect(iframeEstablished).toBe(1);
  });


  jest.useFakeTimers();
  test('should reject while connecting timeout', async () => {
    Parent.setTimeout(timeout);
    Son.setTimeout(timeout);

    const parentOperation = Parent.establish(true);
    const sonOperation = Son.establish(false);
    jest.advanceTimersByTime(timeout);

    await expect(sonOperation).rejects.toBe('connect failed');
    await expect(parentOperation).rejects.toBe('connect failed');
  });

  afterEach(() => {
    // Finish the connections
    Parent.finish();
    Son.finish();
  });
});

describe('SmartPostMessage Test Message', () => {
  let Parent: SmartPostMessage<SonNotifyMap, ParentObserveMap, SonObserveMap, ParentNotifyMap>;
  let Son: SmartPostMessage<ParentNotifyMap, SonObserveMap, ParentObserveMap, SonNotifyMap>;

  beforeEach(async () => {
    const iframe = window.document.createElement('iframe');
    window.document.body.appendChild(iframe);
    if (!iframe.contentWindow) {
      throw new Error('no iframe content');
    }

    const iframeWindow = iframe.contentWindow;

    // Create instances of SmartPostMessage for the parent and iframe windows
    Parent = new SmartPostMessage({
      currentWindow: window,
      targetWindow: iframeWindow,
      targetPathname: '*',
      targetOrigin: '*',
    });

    Son = new SmartPostMessage({
      currentWindow: iframeWindow,
      targetWindow: window,
      targetPathname: '*',
      targetOrigin: '*',
    });

    await Promise.all([
      Parent.establish(true),
      Son.establish(false),
    ]);
  });

  test('request should be returned', async () => {
    Son.observe('getSonUserId', (sonId: string) => {
      return 'Aa123456';
    });

    const reqPromise = Parent.request('getSonUserId', ['sonId']);
    await expect(reqPromise).resolves.toBe('Aa123456');
  });

  test('request should be rejected while error happened', async () => {
    Parent.observe('getParentUserId', (sonId: string) => {
      throw new Error('son error');
    });

    const reqPromise = Son.request('getParentUserId', ['sonId']);
    await expect(reqPromise).rejects.toThrow('son error');
  });

  test('notify should be subscribed', (done) => {
    Son.subscribe('parentNotifyBoolean', (data) => {
      expect(data).toHaveProperty('joined');
      expect(data.joined).toBe(true);

      done();
    });
    Parent.notify('parentNotifyBoolean', { joined: true });

    Parent.subscribe('sonNotifyStr', (data) => {
      expect(data).toBe('I am Son');
      done();
    });
    Son.notify('sonNotifyStr', 'I am Son');
  });

  test.skip('subscribe callback should be invoked once',(done) => {

    // create another subscriber to check `fn` called times.
    Son.subscribe('parentNotifyBoolean', () => {
      expect(callback).toBeCalledTimes(1);
      done();
    });

    // mock a fn to test called time.
    const callback = jest.fn();
    Son.subscribe('parentNotifyBoolean', callback);

    // do notify.
    Parent.notify('parentNotifyBoolean', { joined: false });
  });

  afterEach(() => {
    // Finish the connections
    Parent.finish();
    Son.finish();
  });
});
