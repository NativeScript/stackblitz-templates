import { Application } from '@nativescript/core';
import { render } from '@nativescript-community/solid-js';

import { App } from './app';

document.body.actionBarHidden = true;
render(App, document.body);

const create = () => document;

Application.run({ create });
