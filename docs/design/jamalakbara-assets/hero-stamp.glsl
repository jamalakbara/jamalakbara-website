precision mediump float;
/** @resolution */
uniform vec2 u_resolution;
/** @time */
uniform float u_time;
/** @label Artwork */
uniform sampler2D u_content;
/** @label Motion enabled @default 1 @range 0, 1 */
uniform float u_motion;
/** @label Preview interval @default 12 */
uniform float u_cycle;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = mod(u_time, max(u_cycle, 3.0));
  float approach = smoothstep(0.0, 0.42, t);
  float settle = smoothstep(0.42, 0.72, t);
  float scale = mix(0.88, 0.97, approach) + 0.03 * settle;
  float angle = mix(-0.055, 0.014, approach) * (1.0-settle);
  scale = mix(1.0, scale, u_motion);
  angle *= u_motion;
  vec2 p = uv - 0.5;
  p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p / scale;
  p.y -= (1.0-approach) * 0.025 * u_motion;
  vec2 q = p + 0.5;
  vec4 color = texture2D(u_content, q);
  float inside = step(0.0,q.x)*step(q.x,1.0)*step(0.0,q.y)*step(q.y,1.0);
  gl_FragColor = color * inside * mix(1.0, mix(0.25, 1.0, approach), u_motion);
}
