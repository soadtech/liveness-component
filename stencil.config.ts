import { Config } from '@stencil/core';
import { readFileSync } from 'fs';
import { inlineFile } from '@d0whc3r/stencil-inline-file';

export const config: Config = {
  namespace: 'fas-web-ui-component-camera',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader',
      copy: [
        { src: 'assets/', dest: '../assets' }
      ]
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  devServer: {
    https: {
      cert: readFileSync('./dev/ssl/apache-selfsigned.crt', 'utf8'),
      key: readFileSync('./dev/ssl/apache-selfsigned.key', 'utf8')
    }
  },
  rollupPlugins: {
    before: [
      inlineFile(/\.png/)
    ]
  }
};
