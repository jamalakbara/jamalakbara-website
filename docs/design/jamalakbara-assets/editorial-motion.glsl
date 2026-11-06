#version 100
precision highp float;
/** @resolution */
uniform vec2 u_resolution;
/** @time */
uniform float u_time;
/** @content */
uniform sampler2D u_content;
/** @label Motion style @default 0 @range 0, 2 */
uniform float u_mode;
/** @label Motion amount @default 1 @range 0, 1 */
uniform float u_amount;
/** @label Cycle in seconds @default 12 @range 4, 40 */
uniform float u_cycle;
/** @label Phase offset @default 0 @range 0, 6.28 */
uniform float u_phase;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float wave = 0.5 - 0.5 * cos(u_time * 6.2831853 / u_cycle + u_phase);
  if (u_mode < 0.5) {
    gl_FragColor = texture2D(u_content, uv) * (1.0 - 0.045 * wave * u_amount);
  } else if (u_mode < 1.5) {
    float zoom = 1.0 + 0.035 * wave * u_amount;
    vec2 sampleUV = (uv - 0.5) / zoom + 0.5;
    sampleUV.x += 0.003 * sin(u_time * 6.2831853 / u_cycle + u_phase) * u_amount;
    gl_FragColor = texture2D(u_content, sampleUV);
  } else {
    uv.x = fract(uv.x + u_time / u_cycle * u_amount);
    gl_FragColor = texture2D(u_content, uv);
  }
}
