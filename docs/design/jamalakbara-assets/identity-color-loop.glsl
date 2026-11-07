precision mediump float;
/** @time */
uniform float u_time;
/** @label Motion amount
 * @default 1
 * @range 0, 1
 */
uniform float u_motion;
/** @label Loop duration (seconds)
 * @default 24
 * @range 8, 60
 */
uniform float u_cycle;
/** @label Cobalt @color @default #2445DB */
uniform vec3 u_blue;
/** @label Plum @color @default #73529A */
uniform vec3 u_plum;
/** @label Sage @color @default #456D5B */
uniform vec3 u_sage;
/** @label Clay @color @default #A55E43 */
uniform vec3 u_clay;
/** @label Detail shade
 * @default 1
 * @range 0.5, 1
 */
uniform float u_shade;
void main(){
 float phase=mod(u_time*u_motion/max(u_cycle,1.0),1.0)*4.0;
 float f=fract(phase); f=f*f*(3.0-2.0*f);
 vec3 tint;
 if(phase<1.0) tint=mix(u_blue,u_plum,f);
 else if(phase<2.0) tint=mix(u_plum,u_sage,f);
 else if(phase<3.0) tint=mix(u_sage,u_clay,f);
 else tint=mix(u_clay,u_blue,f);
 gl_FragColor=vec4(tint*u_shade,1.0);
}
