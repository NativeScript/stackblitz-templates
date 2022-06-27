import * as React from 'react';

/* Controls react-nativescript log verbosity. true: all logs; false: only error logs. */
Object.defineProperty(global, '__DEV__', { value: false });

import * as ReactNativeScript from 'react-nativescript';
import { mainStackNavigator as AppContainer } from './components/Navigator';

ReactNativeScript.start(React.createElement(AppContainer, {}, null));
