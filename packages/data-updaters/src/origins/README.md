# Origin upater

A wrapper for the fromObject function of fabricJS.
Once wrapped the function will take a serialized object with any value of originX and originY and return a fabric instance with originX and originY set to the new defaults, but with the same old visual position.

## How to use it

All you need to do is import and call the function `installOriginWrapperUpdater` in your project

```ts
import { installOriginWrapperUpdater } from 'fabric/extensions';

installOriginWrapperUpdater();
```

## Warning

If you used different default values for originX and originY for your application and you exported without default values, this helper won't be useful and will return wrong position.

You have to modifiy the default values in the options. When calling the function you have 2 optional arguments to specify your personal default.

```ts
import { installOriginWrapperUpdater } from 'fabric/extensions';

installOriginWrapperUpdater(0.2, 'bottom');
```

Every data export in fabric has a version tag with the version of the library you are using.
Use that to understand when all your data is at updated.

When instatiating a session in your application, check the version property on the label.
If it needs update run the install once in that session, don't make it a fixed execution.
