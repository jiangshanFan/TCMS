/* eslint-disable */
/**
 *
 * @param  {Number} hh header height
 * @param  {Number} fh  footer height
 * @return {string}
 */

export function mh(hh, fh) {
  let mh = window.innerHeight - hh - fh;
  return mh + 'px';
}
