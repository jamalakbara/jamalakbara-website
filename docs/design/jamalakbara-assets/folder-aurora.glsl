precision mediump float;
/** @resolution */
uniform vec2 u_resolution;
/** @time */
uniform float u_time;
/** @label Motion speed @default 1 @range 0, 2 */
uniform float u_motion;
/** @label Cobalt @color @default #6985E8 */
uniform vec3 u_blue;
/** @label Lilac @color @default #BAA7E4 */
uniform vec3 u_lilac;
/** @label Mint @color @default #A8D6C6 */
uniform vec3 u_mint;
/** @label Peach @color @default #E8B798 */
uniform vec3 u_peach;
void main() {
  vec2 p = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.055 * u_motion;
  vec2 q = p + 0.13 * vec2(sin(p.y * 9.0 + t), cos(p.x * 5.0 - t));
  float a = 0.5 + 0.5 * sin(q.x * 5.1 + q.y * 7.8 + t);
  float b = 0.5 + 0.5 * cos(q.x * 4.4 - q.y * 9.2 - t * 0.8);
  vec3 cool = mix(u_blue, u_lilac, smoothstep(0.1, 0.9, a));
  vec3 warm = mix(u_mint, u_peach, smoothstep(0.15, 0.85, b));
  float blend = 0.5 + 0.5 * sin(q.y * 12.0 + q.x * 3.0 + t * 0.6);
  vec3 color = mix(cool, warm, smoothstep(0.1, 0.9, blend));
  gl_FragColor = vec4(color, 1.0);
}
