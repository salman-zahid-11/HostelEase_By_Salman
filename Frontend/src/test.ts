import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, match?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

const initializers: PromiseLike<any>[] = [];
const testBed = getTestBed();
const platformTestingModule = platformBrowserDynamicTesting();

initializers.push(platformTestingModule.initialize());

Promise.all(initializers)
  .then(() => testBed.initTestEnvironment(BrowserDynamicTestingModule, platformTestingModule))
  .catch(err => console.error('Angular testing environment initialization failed', err));
